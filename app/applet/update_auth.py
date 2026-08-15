path = 'components/auth/AuthContext.tsx'
with open(path, 'r') as f:
    content = f.read()

import re

pattern = r'  const loadUserProfile = async \(uid: string\) => \{.*?\n  \};\s*'
replacement = '''  // Helper to load or create user profile in Firestore (Phase 1)
  const loadOrCreateUserProfile = async (firebaseUser: any) => {
    let profileData: Record<string, any> = {};
    const userRef = doc(db, 'users', firebaseUser.uid);
    try {
      const snapshot = await getDoc(userRef);
      if (snapshot.exists()) {
        profileData = snapshot.data();
        await updateDoc(userRef, {
          lastLoginAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } else {
        profileData = {
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || '',
          email: firebaseUser.email || '',
          photoURL: firebaseUser.photoURL || null,
          provider: firebaseUser.providerData[0]?.providerId || 'password',
          country: '',
          language: 'en',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
          onboardingCompleted: false,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          lastLoginAt: serverTimestamp(),
        };
        await setDoc(userRef, profileData);
      }
    } catch (e) {
      console.warn('Firestore user profile sync warning:', e);
      try {
        const stored = localStorage.getItem('nexorbit_profile_' + firebaseUser.uid);
        if (stored) {
          profileData = JSON.parse(stored);
        }
      } catch (err) {}
    }
    return profileData;
  };
'''

new_content, count = re.subn(pattern, replacement, content, flags=re.DOTALL)
print(f'Replaced loadUserProfile function, count: {count}')

new_content = new_content.replace('await loadUserProfile(firebaseUser.uid)', 'await loadOrCreateUserProfile(firebaseUser)')

with open(path, 'w') as f:
    f.write(new_content)
print('AuthContext successfully updated via script.')
