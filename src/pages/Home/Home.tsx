import * as S from './Home.styles';
import {
  Header,
  Hero,
  About,
  Skills,
  Projects,
  Contact,
  Footer,
} from '../../components';

export function Home() {
  return (
    <S.PageWrapper>
      <Header />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Contact />
      <Footer />
    </S.PageWrapper>
  );
}
