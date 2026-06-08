import { GetServerSideProps } from 'next'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const slug = context.params?.slug
  const path = Array.isArray(slug) ? slug.join('/') : ''
  const destination = `/portal${path ? '/' + path : ''}`

  return {
    redirect: {
      destination,
      permanent: false,
    },
  }
}

export default function PortalCatchAllRedirect() {
  return null
}
