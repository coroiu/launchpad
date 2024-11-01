use std::process::{Command, ExitStatus, Stdio};

pub struct Shell {
    pub shell: String,
}

impl Shell {
    pub fn new(shell: String) -> Self {
        Self { shell }
    }

    pub fn run_inline_program(
        &self,
        program: impl AsRef<str>,
        args: &[impl AsRef<str>],
    ) -> ExitStatus {
        let mut child = Command::new(program.as_ref())
            .args(args.into_iter().map(|s| s.as_ref()))
            .stdin(Stdio::piped()) // Pipe stdin to the command
            .stdout(Stdio::inherit()) // Pipe stdout to the parent process
            .spawn()
            .expect("Failed to start command");

        // If you want to write to the command's stdin
        // if let Some(stdin) = child.stdin.as_mut() {
        //     stdin
        //         .write_all(b"This is foo\nThis is bar\n")
        //         .expect("Failed to write to stdin");
        // }

        // Wait for the command to complete
        let status = child.wait().expect("Failed to wait on child");
        status
    }

    pub fn run_inline_shell_command(&self, command: impl AsRef<str>) -> ExitStatus {
        self.run_inline_program(&self.shell, &["-c", command.as_ref()])
    }
}
