import { GetServerSideProps } from 'next'

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    redirect: {
      destination: '/signin',
      permanent: false,
    },
  }
}

export default function SigninRedirect() {
  return null
}
