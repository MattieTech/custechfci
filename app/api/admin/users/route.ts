import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET() {
  try {
    const supabaseAdmin = createAdminClient();

    // 1. Fetch auth users
    const { data: usersData, error: usersError } = await supabaseAdmin.auth.admin.listUsers();
    if (usersError) {
      console.error('Error listing auth users:', usersError);
      return NextResponse.json({ error: usersError.message }, { status: 500 });
    }

    // 2. Fetch profiles
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
    }

    const profileMap = new Map<string, any>();
    (profiles || []).forEach((p) => {
      profileMap.set(p.id, p);
    });

    // 3. Merge users with profile data and user_metadata
    const combinedUsers = (usersData?.users || []).map((u) => {
      const profile = profileMap.get(u.id);
      const meta = u.user_metadata || {};

      return {
        id: u.id,
        email: u.email || '',
        fullName: meta.full_name || profile?.full_name || '',
        role: profile?.role || 'admin',
        roleTitle: meta.role_title || (profile?.role === 'admin' ? 'Faculty Administrator' : 'Staff'),
        department: meta.department || 'General Faculty',
        level: meta.level || 'All Levels',
        phone: meta.phone || '',
        createdAt: u.created_at,
        lastSignInAt: u.last_sign_in_at || null,
        emailConfirmedAt: u.email_confirmed_at || null,
      };
    });

    return NextResponse.json({ users: combinedUsers });
  } catch (error: any) {
    console.error('API /api/admin/users GET error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to fetch admin users' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, fullName, roleTitle, department, level, phone } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const supabaseAdmin = createAdminClient();

    // Create user in Supabase Auth with metadata
    const { data: userData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: email.trim().toLowerCase(),
      password,
      email_confirm: true,
      user_metadata: {
        full_name: (fullName || '').trim(),
        role: 'admin',
        role_title: (roleTitle || 'Faculty Representative').trim(),
        department: (department || 'General Faculty').trim(),
        level: (level || 'All Levels').trim(),
        phone: (phone || '').trim(),
      },
    });

    if (createError) {
      console.error('Create user error:', createError);
      return NextResponse.json({ error: createError.message }, { status: 400 });
    }

    const newUser = userData.user;

    // Ensure profiles table has role = 'admin' so the user can log into /admin
    try {
      await supabaseAdmin.from('profiles').upsert({
        id: newUser.id,
        email: newUser.email,
        full_name: (fullName || '').trim(),
        role: 'admin',
        updated_at: new Date().toISOString(),
      });
    } catch (profileErr) {
      console.error('Error upserting profile:', profileErr);
    }

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        fullName: (fullName || '').trim(),
        role: 'admin',
        roleTitle: roleTitle || 'Faculty Representative',
        department: department || 'General Faculty',
        level: level || 'All Levels',
        phone: phone || '',
        createdAt: newUser.created_at,
      },
    });
  } catch (error: any) {
    console.error('API /api/admin/users POST error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to onboard admin user' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, password, fullName, roleTitle, department, level, phone } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const supabaseAdmin = createAdminClient();

    // 1. Fetch current user
    const { data: currentUserData, error: getUserError } = await supabaseAdmin.auth.admin.getUserById(userId);
    if (getUserError || !currentUserData?.user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const currentMeta = currentUserData.user.user_metadata || {};
    const updatedMeta = {
      ...currentMeta,
      ...(fullName !== undefined && { full_name: fullName.trim() }),
      ...(roleTitle !== undefined && { role_title: roleTitle.trim() }),
      ...(department !== undefined && { department: department.trim() }),
      ...(level !== undefined && { level: level.trim() }),
      ...(phone !== undefined && { phone: phone.trim() }),
    };

    const updatePayload: any = {
      user_metadata: updatedMeta,
    };

    if (password && password.trim()) {
      if (password.length < 6) {
        return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
      }
      updatePayload.password = password;
    }

    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(userId, updatePayload);
    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // Update profile table
    if (fullName !== undefined) {
      await supabaseAdmin.from('profiles').update({
        full_name: fullName.trim(),
        updated_at: new Date().toISOString(),
      }).eq('id', userId);
    }

    return NextResponse.json({ success: true, message: 'User updated successfully' });
  } catch (error: any) {
    console.error('API /api/admin/users PUT error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const supabaseAdmin = createAdminClient();

    // Delete from profiles
    try {
      await supabaseAdmin.from('profiles').delete().eq('id', userId);
    } catch (e) {
      console.warn('Error deleting from profiles:', e);
    }

    // Delete from auth
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'User access revoked successfully' });
  } catch (error: any) {
    console.error('API /api/admin/users DELETE error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to delete user' }, { status: 500 });
  }
}

