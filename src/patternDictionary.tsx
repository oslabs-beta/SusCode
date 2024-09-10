const patterns = [
  /eval ?\(/g,
  /exec ?\(/g,
  /system ?\(/g,
  /popen ?\(/g,
  /shell_exec ?\(/g,
  /os.system ?\(/g,
  /document.write ?\(/g,
  /dangerouslySetInnerHTML ?\(/g,
];

export const patternDictionary: any = {
  eval: {
    heading: 'Evaluation',
    info: 'This code pattern can introduce vulnerabilities because it allows the execution of arbitrary code in a way that is hard to control. This makes the code within this extension vulnerable to attacks. Specifically, eval executes a string as JavaScript code. It can easily allow attackers to execute arbitrary code if untrusted input is passed to it, leading to code injection vulnerabilities.',
    regex: [patterns[0]],
  },
  exec: {
    heading: 'Execute',
    info: 'This code pattern can introduce vulnerabilities because it allows the execution of arbitrary code in a way that is hard to control. This makes the code within this extension vulnerable to attacks. Specifically, exec executes system commands in many programming languages (e.g., PHP, Python). Like shell_exec, it can be used for command injection if untrusted input is processed without validation.',
    regex: [patterns[1]],
  },
  System: {
    heading: 'System Commands',
    info: 'This code pattern can introduce vulnerabilities because it allows the execution of arbitrary code or the insertion of content in a way that is hard to control. This makes the code within this extension vulnerable to attacks. Specifically, System commands (e.g., System() in Java) allow running system-level commands. If unvalidated input is passed, it could result in command injection and compromise system security.',
    regex: [patterns[2]],
  },
  popen: {
    heading: 'Shell Execution',
    info: 'Opens a pipe to or from a process, allowing for execution of system commands and communication with them. If user input is passed to popen without validation or sanitization, it can result in command injection, enabling attackers to execute malicious commands.',
    regex: [patterns[3]],
  },
  shell_exec: {
    heading: 'Shell Execution',
    info: 'This code pattern can introduce vulnerabilities because it allows the execution of arbitrary code in a way that is hard to control. This makes the code within this extension vulnerable to attacks. Specifically, shell_exec executes shell commands directly from the code. If untrusted input is passed to it, it can lead to command injection, allowing attackers to execute arbitrary system commands.',
    regex: [patterns[4]],
  },
  'os.system': {
    heading: 'System-level Commands',
    info: 'This code pattern can introduce vulnerabilities because it allows the execution of arbitrary code in a way that is hard to control. This makes the code within this extension vulnerable to attacks. Specifically, os.system runs shell commands in Python. Passing unvalidated or unsanitized user input can allow attackers to execute harmful commands, resulting in command injection.',
    regex: [patterns[5]],
  },
  'document.write': {
    heading: 'Cross-Site Scripting (XSS)',
    info: 'This code pattern can introduce vulnerabilities because it allows the insertion of content in a way that is hard to control. This makes the code within this extension vulnerable to attacks. Specifically, document.write inserts content directly into the DOM in JavaScript. If it includes user-controlled input, it can lead to cross-site scripting (XSS) attacks, allowing malicious scripts to be executed in the user’s browser.',
    regex: [patterns[6]],
  },
  dangerouslySetInnerHTML: {
    heading: 'React- Exposes App to XSS',
    info: 'This code pattern can introduce vulnerabilities because it allows the insertion of content in a way that is hard to control. This makes the code within this extension vulnerable to attacks. Specifically, dangerouslySetInnerHTML is a React property that sets HTML directly in the DOM. If untrusted data is used without proper sanitization, it poses a high risk of XSS by injecting harmful HTML or scripts into the webpage.',
    regex: [patterns[7]],
  },
};

module.exports = patternDictionary;
