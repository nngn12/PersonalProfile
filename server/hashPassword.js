import bcrypt from "bcrypt";

async function hashMyPassword() {
    const plainTextPassword = "admin123";
    const saltRounds = 10;

    const hashedPassword = await bcrypt.hash(plainTextPassword, saltRounds);

    console.log("-------------------------------------------------");
    console.log("Your plain text password is:", plainTextPassword);
    console.log("Your HASHED password is:", hashedPassword);
    console.log("-------------------------------------------------");
}

hashMyPassword();