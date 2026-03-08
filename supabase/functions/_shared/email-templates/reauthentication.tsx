/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface ReauthenticationEmailProps {
  token: string
}

export const ReauthenticationEmail = ({ token }: ReauthenticationEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your verification code — Support Studio™</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={brand}>SUPPORT STUDIO™</Text>
        <Hr style={divider} />
        <Heading style={h1}>Verification code</Heading>
        <Text style={text}>Use the code below to confirm your identity:</Text>
        <Text style={codeStyle}>{token}</Text>
        <Text style={footer}>
          This code will expire shortly. If you didn't request this, no action is needed.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default ReauthenticationEmail

const main = { backgroundColor: '#ffffff', fontFamily: "'Inter', 'Space Grotesk', Arial, sans-serif" }
const container = { padding: '40px 32px', maxWidth: '480px', margin: '0 auto' }
const brand = {
  fontSize: '11px',
  fontWeight: '600' as const,
  letterSpacing: '0.3em',
  color: '#1E3D2F',
  textTransform: 'uppercase' as const,
  margin: '0 0 24px',
}
const divider = { borderColor: '#E8E5DF', margin: '0 0 32px' }
const h1 = {
  fontSize: '24px',
  fontWeight: '700' as const,
  fontFamily: "'Space Grotesk', Arial, sans-serif",
  color: '#121212',
  margin: '0 0 16px',
}
const text = { fontSize: '15px', color: '#666666', lineHeight: '1.6', margin: '0 0 20px' }
const codeStyle = {
  fontFamily: "'Space Grotesk', Courier, monospace",
  fontSize: '28px',
  fontWeight: '700' as const,
  color: '#1E3D2F',
  letterSpacing: '0.15em',
  margin: '0 0 32px',
}
const footer = { fontSize: '12px', color: '#999999', margin: '0', lineHeight: '1.5' }
