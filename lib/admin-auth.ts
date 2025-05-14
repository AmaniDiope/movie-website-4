import { compare, hash } from "bcrypt"
import { executeQuery } from "./db"
import { cookies } from "next/headers"

// Authenticate admin user
export async function authenticateAdmin(username: string, password: string) {
  try {
    const users = await executeQuery("SELECT * FROM admin_users WHERE username = $1 LIMIT 1", [username])

    if (!users.length) {
      console.log("No user found with username:", username)
      return null
    }

    const user = users[0]

    // Log for debugging (remove in production)
    console.log("Found user:", { id: user.id, username: user.username })

    // Use bcrypt to compare the provided password with the stored hash
    const isValid = await compare(password, user.password)

    console.log("Password validation result:", isValid)

    if (!isValid) {
      return null
    }

    // Don't return the password
    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
  } catch (error) {
    console.error("Authentication error:", error)
    return null
  }
}

// Get current admin user from cookie
export async function getCurrentAdmin() {
  const adminId = cookies().get("admin_id")?.value

  if (!adminId) {
    return null
  }

  try {
    const users = await executeQuery("SELECT id, username, is_super_admin, created_at FROM admin_users WHERE id = $1", [
      adminId,
    ])

    return users[0] || null
  } catch (error) {
    console.error("Error getting current admin:", error)
    return null
  }
}

// Create a new admin user
export async function createAdmin(username: string, password: string, isSuperAdmin = false) {
  try {
    const hashedPassword = await hash(password, 10)

    const result = await executeQuery(
      "INSERT INTO admin_users (username, password, is_super_admin) VALUES ($1, $2, $3) RETURNING id, username, is_super_admin",
      [username, hashedPassword, isSuperAdmin],
    )

    return result[0]
  } catch (error) {
    console.error("Error creating admin:", error)
    throw error
  }
}
