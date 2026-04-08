import passport from 'passport'
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback
} from 'passport-google-oauth20'
import { envVars } from './config'
import { User } from '../modules/user/user.model'
import { Role } from '../modules/user/user.interface'

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

      await User.create()
    }
  )
)
