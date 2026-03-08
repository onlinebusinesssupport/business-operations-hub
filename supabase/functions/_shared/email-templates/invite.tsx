/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface InviteEmailProps {
  siteName: string
  siteUrl: string
  confirmationUrl: string
}

export const InviteEmail = ({
  siteName,
  siteUrl,
  confirmationUrl,
}: InviteEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>You've been invited to Support Studio™</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={brand}>SUPPORT STUDIO™</Text>
        <Hr style={divider} />
        <Heading style={h1}>You've been invited</Heading>
        <Text style={text}>
          You've been invited to join{' '}
          <Link href={siteUrl} style={link}>Support Studio™</Link>.
          Accept the invitation below to set up your workspace and get started.
        </Text>
        <Button style={button} href={confirmationUrl}>
          Accept Invitation
        </Button>
        <Text style={footer}>
          If you weren't expecting this, you can safely ignore this email.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default InviteEmail

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
const link = { color: '#1E3D2F', textDecoration: 'underline' }
const button = {
  backgroundColor: '#1E3D2F',
  color: '#F5F3EF',
  fontSize: '14px',
  fontWeight: '600' as const,
  borderRadius: '0px',
  padding: '14px 28px',
  textDecoration: 'none',
  display: 'inline-block' as const,
  margin: '0 0 32px',
}
const footer = { fontSize: '12px', color: '#999999', margin: '0', lineHeight: '1.5' }
