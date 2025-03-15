export interface ISignupUseCase {
  execute(
    name: string,
    email: string,
    password: string
  ): Promise<{
    status: number;
    message: string;
    success: boolean;
  }>;
}
