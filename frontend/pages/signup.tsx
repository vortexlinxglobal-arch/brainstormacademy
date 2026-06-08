import { GetServerSideProps } from 'next'

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    redirect: {
      destination: '/signup',
      permanent: false,
    },
  }
}

export default function SignupRedirect() {
  return null
}
