import { envVars } from '../config/config'
import { IAuthProvider, IUser, Role } from '../modules/user/user.interface'
import { User } from '../modules/user/user.model'
import bcrypt from 'bcryptjs'

const seedSuperAdmin = async () => {
  try {
    const isUserExist = await User.findOne({ email: envVars.SUPER_ADMIN_EMAIL })

    if (isUserExist) {
      console.log('Super User already exist')
      return
    }

    const authProvider: IAuthProvider = {
      provider: 'credential',
      providerID: envVars.SUPER_ADMIN_EMAIL,
    }

    const hashPassword = await bcrypt.hash(
      envVars.SUPER_ADMIN_PASSWORD as string,
      Number(envVars.BCRYPT_SALT_ROUND)
    )

    const superAdminPayload: IUser = {
      name: 'Super Admin',
      email: envVars.SUPER_ADMIN_EMAIL,
      role: Role.SUPER_ADMIN,
      auths: [authProvider],
      password: hashPassword,
    }
    const createSuperAdmin = await User.create(superAdminPayload)
    if (createSuperAdmin) {
      console.log('Super Admin created')
    }
  } catch (error) {
    console.log(error)
  }
}

export default seedSuperAdmin
