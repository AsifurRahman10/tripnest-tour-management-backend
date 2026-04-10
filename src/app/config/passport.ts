/* eslint-disable @typescript-eslint/no-explicit-any */
import passport from 'passport'
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback
} from 'passport-google-oauth20'
import { envVars } from './config'
import { User } from '../modules/user/user.model'
import { Role } from '../modules/user/user.interface'
import { Strategy as localStrategy } from 'passport-local'
import bcrypt from 'bcryptjs'

passport.use(
  new localStrategy(
    { usernameField: 'email', passwordField: 'password' },
    async (email: string, password: string, done: any) => {
      try {
        const isUserExist = await User.findOne({ email })
        if (!isUserExist) {
          return done(null, false, { message: 'User does not exist' })
        }

        const isRegisterWithGoogle = isUserExist.auths.some(
          (p) => p.provider == 'google'
        )

        if (isRegisterWithGoogle && !isUserExist.password) {
          return done(null, false, {
            message:
              'You are registered with google, please login with google or if you want to login with email and password, please set a password in your profile'
          })
        }
        const isPasswordMatch = await bcrypt.compare(
          password as string,
          isUserExist?.password as string
        )

        if (!isPasswordMatch) {
          return done(null, false, { message: 'Password does not match' })
        }
        return done(null, isUserExist)
      } catch (error) {
        done(error)
      }
    }
  )
)

passport.use(
  new GoogleStrategy(
    {
      clientID: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
      callbackURL: envVars.GOOGLE_CALLBACK_URL
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      const email = profile.emails?.[0].value
      if (!email) {
        return done(null, false, { message: 'email does not exist' })
      }
      let user = await User.findOne({ email })

      if (!user) {
        user = await User.create({
          email,
          name: profile.displayName,
          image: profile.photos?.[0].value,
          isVerified: 'true',
          role: Role.USER,
          auths: [
            {
              provider: 'google',
              providerID: profile?.id
            }
          ]
        })
      }

      return done(null, user)
    }
  )
)

passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
  done(null, user._id)
})

passport.deserializeUser(
  async (id: any, done: (err: any, user?: unknown) => void) => {
    try {
      const user = await User.findById(id)
      done(null, user)
    } catch (error) {
      console.log(error)
      done(error)
    }
  }
)
