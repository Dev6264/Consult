export function requireGptAuth(req: Request) {
  const key = req.headers.get('x-api-key');
  return key && key === process.env.GPT_ACTIONS_API_KEY;
}
