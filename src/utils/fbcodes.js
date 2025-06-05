const errorCodes = code => {
  const codes = {
    'auth/invalid-credential': 'Invalid email or password.',
    'auth/user-disabled': 'User account has been disabled.',
    'auth/user-not-found': 'No user found with this email.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/email-already-in-use': 'Email is already in use.',
    'auth/weak-password': 'Password is too weak.',
  }
  return codes[code] || 'An unknown error occurred.'
}
export default errorCodes
