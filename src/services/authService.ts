import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  AuthErrorCodes
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from './firebase';

export interface SignUpData {
  email: string;
  password: string;
  name: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export const signUp = async ({ email, password, name }: SignUpData) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const { user } = userCredential;

    // Update user profile with name
    await updateProfile(user, { displayName: name });

    // Store additional user data in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      name,
      email,
      createdAt: new Date().toISOString()
    });

    return user;
  } catch (error: any) {
    console.error('Error signing up:', error);
    
    // Provide user-friendly error messages
    if (error.code === AuthErrorCodes.EMAIL_EXISTS) {
      throw new Error('This email is already in use');
    } else if (error.code === AuthErrorCodes.WEAK_PASSWORD) {
      throw new Error('Password should be at least 6 characters');
    } else if (error.code === AuthErrorCodes.INVALID_EMAIL) {
      throw new Error('Please enter a valid email address');
    } else {
      throw new Error('An error occurred during sign up');
    }
  }
};

export const signIn = async ({ email, password }: SignInData) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error: any) {
    console.error('Error signing in:', error);
    
    // Provide user-friendly error messages
    if (error.code === AuthErrorCodes.USER_DELETED || 
        error.code === AuthErrorCodes.INVALID_PASSWORD) {
      throw new Error('Invalid email or password');
    } else {
      throw new Error('An error occurred during sign in');
    }
  }
};

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    
    // Store additional user data in Firestore if it's a new user
    if (result.user) {
      await setDoc(doc(db, 'users', result.user.uid), {
        name: result.user.displayName,
        email: result.user.email,
        createdAt: new Date().toISOString()
      }, { merge: true }); // Use merge to avoid overwriting existing data
    }
    
    return result.user;
  } catch (error: any) {
    console.error('Error signing in with Google:', error);
    throw new Error('An error occurred during Google sign in');
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw new Error('An error occurred during sign out');
  }
};