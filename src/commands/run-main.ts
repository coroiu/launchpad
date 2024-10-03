export function runMain(callback: () => Promise<unknown>) {
  callback().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
