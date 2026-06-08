import { GetServerSideProps } from 'next'

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    redirect: {
      destination: '/portal',
      permanent: false,
    },
  }
}

export default function PortalRedirect() {
  return null
}
