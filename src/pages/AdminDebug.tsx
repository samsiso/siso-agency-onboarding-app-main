import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { makeUserAdmin, addUserToAdminRole } from '@/utils/supabaseHelpers';

export const AdminDebug = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [userRoles, setUserRoles] = useState<any[]>([]);
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      setLoading(true);
      try {
        // Get current session
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          setMessage(`Error getting session: ${error.message}`);
          return;
        }
        
        if (!session) {
          setMessage('No active session. Please log in first.');
          return;
        }
        
        setUserId(session.user.id);
        setUserEmail(session.user.email);
        
        // Check roles
        await checkUserRole(session.user.id);
        
        // Check admin status via RPC
        const { data: adminStatus, error: rpcError } = await supabase.rpc('is_admin', { user_id: session.user.id });
        if (rpcError) {
          setMessage(`RPC Error: ${rpcError.message}`);
        } else {
          setIsAdmin(!!adminStatus);
        }
      } catch (err) {
        if (err instanceof Error) {
          setMessage(`Error: ${err.message}`);
        } else {
          setMessage('Unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };
    
    checkSession();
  }, []);
  
  const checkUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId);
        
      if (error) {
        setMessage(`Error fetching roles: ${error.message}`);
        return;
      }
      
      setUserRoles(data || []);
    } catch (err) {
      if (err instanceof Error) {
        setMessage(`Error checking role: ${err.message}`);
      }
    }
  };
  
  const handleMakeMeAdmin = async () => {
    if (!userEmail) return;
    
    setLoading(true);
    setMessage('Making user admin...');
    
    try {
      const result = await makeUserAdmin(userEmail);
      if (result) {
        setMessage('Successfully made user an admin! Please reload the page.');
      } else {
        setMessage('Failed to make user admin.');
      }
      
      // Refresh roles
      if (userId) {
        await checkUserRole(userId);
      }
      
      // Check admin status via RPC again
      if (userId) {
        const { data: adminStatus, error: rpcError } = await supabase.rpc('is_admin', { user_id: userId });
        if (rpcError) {
          setMessage(prev => `${prev} RPC Error: ${rpcError.message}`);
        } else {
          setIsAdmin(!!adminStatus);
        }
      }
    } catch (err) {
      if (err instanceof Error) {
        setMessage(`Error: ${err.message}`);
      } else {
        setMessage('Unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleDirectAddRole = async () => {
    if (!userId) return;
    
    setLoading(true);
    setMessage('Directly adding admin role...');
    
    try {
      // Try direct insert without any checks
      const { error } = await supabase
        .from('user_roles')
        .insert([{ user_id: userId, role: 'admin' }]);
        
      if (error) {
        setMessage(`Error directly adding role: ${error.message}`);
      } else {
        setMessage('Successfully added admin role directly! Please reload the page.');
      }
      
      // Refresh roles
      await checkUserRole(userId);
    } catch (err) {
      if (err instanceof Error) {
        setMessage(`Error: ${err.message}`);
      } else {
        setMessage('Unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Debug Tool</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">User Information</h2>
        {loading ? (
          <div className="flex items-center justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 mb-4">
              <div>
                <p className="font-medium">User ID:</p>
                <p className="text-gray-700">{userId || 'Not logged in'}</p>
              </div>
              <div>
                <p className="font-medium">Email:</p>
                <p className="text-gray-700">{userEmail || 'Not available'}</p>
              </div>
              <div>
                <p className="font-medium">Admin Status from RPC:</p>
                <p className="text-gray-700">
                  {isAdmin === null ? 'Unknown' : isAdmin ? 'Is Admin' : 'Not Admin'}
                </p>
              </div>
            </div>
            
            <div className="mb-4">
              <h3 className="font-medium mb-2">User Roles:</h3>
              {userRoles.length === 0 ? (
                <p className="text-gray-500">No roles found</p>
              ) : (
                <ul className="list-disc pl-5">
                  {userRoles.map((role, index) => (
                    <li key={index} className="text-gray-700">
                      Role: {role.role}, ID: {role.id}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            {message && (
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                <p className="text-blue-700">{message}</p>
              </div>
            )}
            
            <div className="flex flex-col md:flex-row gap-4">
              <Button 
                onClick={handleMakeMeAdmin} 
                disabled={loading || !userEmail}
                className="bg-green-500 hover:bg-green-600"
              >
                Make Me Admin
              </Button>
              
              <Button 
                onClick={handleDirectAddRole} 
                disabled={loading || !userId}
                className="bg-yellow-500 hover:bg-yellow-600 text-white"
              >
                Direct Add Admin Role
              </Button>
            </div>
          </>
        )}
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Instructions</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>This page helps debug and fix admin role issues</li>
          <li>If you're not showing as admin, try the "Make Me Admin" button</li>
          <li>If that doesn't work, try "Direct Add Admin Role"</li>
          <li>After successfully adding the role, reload the page and try logging out/in again</li>
        </ol>
      </div>
    </div>
  );
}; 