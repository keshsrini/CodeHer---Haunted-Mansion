// Language support for different programming languages

// Get starter code for a specific language
function getStarterCodeForLanguage(challenge, language) {
    // If language specific starter code exists, use it
    const languageKey = `${language}_starterCode`;
    if (challenge[languageKey]) {
        return challenge[languageKey];
    }
    
    // Otherwise, generate from the JavaScript starter code
    switch (language) {
        case 'javascript':
            return challenge.starterCode || '';
            
        case 'python':
            // Convert JavaScript to Python-like starter code
            let pythonCode = challenge.starterCode || '';
            pythonCode = pythonCode.replace(/\/\//g, '#'); // Replace comments
            pythonCode = pythonCode.replace(/function\s+\w+\s*\(/g, 'def '); // Replace function declarations
            pythonCode = pythonCode.replace(/\)\s*{/g, '):'); // Replace function brackets
            pythonCode = pythonCode.replace(/;/g, ''); // Remove semicolons
            pythonCode = pythonCode.replace(/\}/g, ''); // Remove closing braces
            return pythonCode;
            
        case 'java':
            // Generate Java method structure
            const funcName = challenge.title.toLowerCase().replace(/\s/g, '');
            return `public static ${guessReturnType(challenge.tests[0].expected)} ${funcName}(${generateJavaParams(challenge.functionArgs)}) {
    // TODO: Implement solution
    ${javaReturnStatement(challenge.tests[0].expected)}
}`;
            
        case 'c':
            // Generate C function structure
            const cFuncName = challenge.title.toLowerCase().replace(/\s/g, '');
            return `${guessCReturnType(challenge.tests[0].expected)} ${cFuncName}(${generateCParams(challenge.functionArgs)}) {
    /* TODO: Implement solution */
    ${cReturnStatement(challenge.tests[0].expected)}
}`;
            
        case 'cpp':
            // Generate C++ function structure
            const cppFuncName = challenge.title.toLowerCase().replace(/\s/g, '');
            return `${guessCppReturnType(challenge.tests[0].expected)} ${cppFuncName}(${generateCppParams(challenge.functionArgs)}) {
    // TODO: Implement solution
    ${cppReturnStatement(challenge.tests[0].expected)}
}`;
            
        default:
            return challenge.starterCode || '';
    }
}

// Helper functions for language-specific code generation
function guessReturnType(expected) {
    if (Array.isArray(expected)) return "int[]";
    if (typeof expected === 'number') return "int";
    if (typeof expected === 'string') return "String";
    if (typeof expected === 'boolean') return "boolean";
    return "Object";
}

function guessCReturnType(expected) {
    if (Array.isArray(expected)) return "int*";
    if (typeof expected === 'number') return "int";
    if (typeof expected === 'string') return "char*";
    if (typeof expected === 'boolean') return "int"; // C uses int for boolean
    return "void*";
}

function guessCppReturnType(expected) {
    if (Array.isArray(expected)) return "std::vector<int>";
    if (typeof expected === 'number') return "int";
    if (typeof expected === 'string') return "std::string";
    if (typeof expected === 'boolean') return "bool";
    return "auto";
}

function generateJavaParams(args) {
    if (!args || !args.length) return "";
    return args.map(arg => `int ${arg}`).join(", ");
}

function generateCParams(args) {
    if (!args || !args.length) return "";
    return args.map(arg => `int ${arg}`).join(", ");
}

function generateCppParams(args) {
    if (!args || !args.length) return "";
    return args.map(arg => `int ${arg}`).join(", ");
}

function javaReturnStatement(expected) {
    if (typeof expected === 'number') return "return 0;";
    if (Array.isArray(expected)) return "return new int[] {0};";
    if (typeof expected === 'string') return "return \"\";";
    if (typeof expected === 'boolean') return "return false;";
    return "return null;";
}

function cReturnStatement(expected) {
    if (typeof expected === 'number') return "return 0;";
    if (Array.isArray(expected)) return "/* Return array pointer */\nreturn NULL;";
    if (typeof expected === 'string') return "return \"\";";
    if (typeof expected === 'boolean') return "return 0;"; // C uses int for boolean
    return "return NULL;";
}

function cppReturnStatement(expected) {
    if (typeof expected === 'number') return "return 0;";
    if (Array.isArray(expected)) return "return std::vector<int>();";
    if (typeof expected === 'string') return "return \"\";";
    if (typeof expected === 'boolean') return "return false;";
    return "return {};";
}