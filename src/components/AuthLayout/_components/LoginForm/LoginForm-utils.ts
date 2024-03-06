export function parseLoginError(message: string) {
  if(message === "Invalid login credentials") {
    return "Email ou mot de passe invalide."
  }
}