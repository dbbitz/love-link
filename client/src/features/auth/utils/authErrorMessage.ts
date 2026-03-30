import { FirebaseError } from "firebase/app";

export function getAuthErrorMessage(error: unknown): string {
  if (!(error instanceof FirebaseError)) {
    return "Ocorreu um erro inesperado. Tente novamente.";
  }

  switch (error.code) {
    case "auth/invalid-email":
      return "E-mail invalido.";
    case "auth/email-already-in-use":
      return "Este e-mail ja esta em uso.";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Credenciais invalidas.";
    case "auth/weak-password":
      return "Senha fraca. Use ao menos 6 caracteres.";
    case "auth/too-many-requests":
      return "Muitas tentativas. Aguarde alguns minutos.";
    default:
      return "Nao foi possivel autenticar. Tente novamente.";
  }
}
