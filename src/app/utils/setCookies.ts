import { Response } from 'express'
interface CookieTypes {
  accessToken?: string
  refreshToken?: string
}
export const sendCookie = (res: Response, loginInfo: CookieTypes) => {
  if (loginInfo.accessToken) {
    res.cookie('accessToken', loginInfo.accessToken, {
      httpOnly: true,
      secure: false
    })
  }
  if (loginInfo.refreshToken) {
    res.cookie('refreshToken', loginInfo.refreshToken, {
      httpOnly: true,
      secure: false
    })
  }
}
