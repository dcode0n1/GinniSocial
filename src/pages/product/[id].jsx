import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import Head from 'next/head';

const Container = styled(motion.div)`
  display: flex;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f0f0;
`;

const Card = styled(motion.div)`
  background-color: #fff;
  margin: 1rem;
  border-radius: 12px;
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  max-width: 600px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: transform 0.2s ease-in-out;
  &:hover {
    transform: translateY(-10px);
  }
`;

const ImageContainer = styled(motion.div)`
  width: 100%;
  max-width: 200px;
  margin-bottom: 1.5rem;
`;

const ProductImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 8px;
`;

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h2`
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const Description = styled.p`
  font-size: 1.1rem;
  color: #555;
  margin-bottom: 1.5rem;
`;

const Price = styled.p`
  font-size: 1.5rem;
  color: #333;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const Rating = styled.div`
  font-size: 1.1rem;
  color: #f39c12;
  margin-bottom: 1.5rem;
`;

const Button = styled(motion.button)`
  padding: 0.75rem 2rem;
  background-color: #0070f3;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;

  &:hover {
    background-color: #005bb5;
  }
`;


//  In Point 4 1 is product Id and we can put any product id here and it will show us the product details.
// When using the SSR the main concern is the data should be collectively come from the server and the client should not have to wait for the data to be fetched from the server. This is the main advantage of using SSR.So that is the reason we use the getServerSideProps here such that if we go on network we can see the dom along with the items, so the seo eventually works better in here;

export async function getServerSideProps(context) {
  const { id } = context.params;
  try {
    const res = await fetch(`https://fakestoreapi.com/products/${id}`);
    const product = await res.json()
    if (!product) {
      return {
        notFound: true,
      };
    }
    return {
      props: { product },
    };
  } catch (error) {
    console.error("Error fetching product:", error);
    return {
      props: { product: null },
    };
  }
}


export default function ProductPage({ product }) {
  if (!product) {
    return <div>Product not found</div>;
  }
  return (
    <>

      {/* When any url shared in whatsapp it should give prieview of product (Check example of instagram video share, amazon product share) */}

      {/* Basically when we share something over the web the  meta property actually acts as a preview of the content that we are sharing. */}
      <Head>
        <title>{product.title}</title>
        <meta property="og:title" content={product.title} />
        <meta property="og:description" content={product.description} />
        <meta property="og:image" content={product.image} />
        <meta property="og:url" content={`https://yourwebsite.com/product/${product.id}`} />
        <meta property="og:type" content="product" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={product.title} />
        <meta name="twitter:description" content={product.description} />
        <meta name="twitter:image" content={product.image} />
      </Head>
      <Container
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
        >
          <ImageContainer>
            <ProductImage src={product.image} alt={product.title} />
          </ImageContainer>
          <ProductInfo>
            <Title>{product.title}</Title>
            <Description>{product.description}</Description>
            <Price>${product.price}</Price>
            <Rating>Rating: {product.rating.rate} / 5 ({product.rating.count} reviews)</Rating>
            <Button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              Add to Cart
            </Button>
          </ProductInfo>
        </Card>
      </Container>
    </>
  );
}
