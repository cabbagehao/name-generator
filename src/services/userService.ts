import { 
  updateProfile as updateFirebaseProfile,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  User
} from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

export interface UpdateNameData {
  name: string;
}

export interface UpdatePasswordData {
  currentPassword: string;
  newPassword: string;
}

export const updateUserName = async ({ name }: UpdateNameData) => {
  const user = auth.currentUser;
  if (!user) throw new Error('No user logged in');

  try {
    // Update Firebase Auth profile
    await updateFirebaseProfile(user, { displayName: name });

    // Update Firestore user document
    await updateDoc(doc(db, 'users', user.uid), {
      name,
      updatedAt: new Date().toISOString()
    });

    return true;
  } catch (error) {
    console.error('Error updating name:', error);
    throw new Error('Failed to update name');
  }
};

export const updateUserPassword = async ({ currentPassword, newPassword }: UpdatePasswordData) => {
  const user = auth.currentUser;
  if (!user?.email) throw new Error('No user logged in');

  try {
    // Re-authenticate user before password change
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);

    // Update password
    await updatePassword(user, newPassword);

    return true;
  } catch (error: any) {
    console.error('Error updating password:', error);
    if (error.code === 'auth/wrong-password') {
      throw new Error('Current password is incorrect');
    }
    throw new Error('Failed to update password');
  }
};