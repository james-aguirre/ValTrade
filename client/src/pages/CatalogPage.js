import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';
import { useEffect, useState } from 'react';
import { fetchCatalog } from '../lib/api';
import { Link } from 'react-router-dom';
import Loading from './LoadingPage';
import './CatalogPage.css';

export default function Catalog({ product }) {
  const [products, setProducts] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();
  const [filter, setFilter] = useState('');

  useEffect(() => {
    async function loadCatalog() {
      try {
        const products = await fetchCatalog();
        setProducts(products);
      } catch (e) {
        setError(e);
      } finally {
        setIsLoading(false);
      }
    }
    setIsLoading(true);
    loadCatalog();
  }, []);
  if (isLoading) return <Loading />;
  if (error) return <div>Error Loading Catalog: {error.message}</div>;

  let filteredProducts = products.filter(
    (p) =>
      p.productName.toLowerCase().includes(filter) ||
      p.productName.toUpperCase().includes(filter) ||
      p.category.includes(filter)
  );
  return (
    <Container fluid className="catalog-container">
      <div className="items-container">
        <Row>
          <Filter value={filter} onChange={setFilter} />
        </Row>
        <Row>
          {filteredProducts?.map((product) => (
            <Col
              xs={12}
              md={2}
              className="card-wrapper"
              key={product.productId}>
              <Product product={product} />
            </Col>
          ))}
        </Row>
      </div>
    </Container>
  );
}

function Product({ product }) {
  const { productId, productName, imageUrl } = product;
  return (
    <Link to={`/${productId}`}>
      <Image className="img-fluid" src={imageUrl} alt={productName} />
      <p className="thumbnail-text">{productName}</p>
    </Link>
  );
}

function Filter({ filter, onChange }) {
  return (
    <form>
      <Row>
        <Col className="justify-flex-center">
          <select
            aria-label="small"
            className="mb-3"
            onChange={(e) => {
              onChange(e.target.value);
            }}>
            <option value="">WEAPON TYPE</option>
            <option value="melee">MELEE</option>
            <option value="rifle">RIFLE</option>
            <option value="sniper">SNIPER</option>
            <option value="sidearm">SIDEARM</option>
            <option value="shotgun">SHOTGUN</option>
          </select>
        </Col>
        <Col>
          <input
            type="text"
            value={filter}
            onChange={(e) => {
              onChange(e.target.value);
            }}
            placeholder="Search"
            className="search-filter"
          />
        </Col>
      </Row>
    </form>
  );
}
