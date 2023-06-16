import Pika from './components/Pika';
import Nav from './components/Nav';
import Footer from './components/Footer';
import Welcome from './components/Welcome';

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.about = React.createRef();
    this.tech = React.createRef();
	  this.music = React.createRef();
    this.state = {
      aboutActive: 'ready',
      techActive: 'ready',
      musicActive: 'ready',
      loaded: 'ready'
    }
  }
  
  componentDidMount() {
    const music = this.music.current;
    const tech = this.tech.current;
    const about = this.about.current;
    document.body.style.background = '#fff';
    var options = {
      root: null,
      threshold: .3
    };
      var callBack = (obs) => {
        var target = obs[0].target;

        if (target === about) {
          if (!obs[0].isIntersecting) return;
          this.setState({ aboutActive: 'active' });
          observer.unobserve(about);
        } else if (target === music) {
          if (!obs[0].isIntersecting) return;
          this.setState({ musicActive: 'active' });
          observer.unobserve(music);
        } else if (target === tech) {
          if (!obs[0].isIntersecting) return;
          this.setState({ techActive: 'active' });
          observer.unobserve(tech);
        }
      };

	      var observer = new IntersectionObserver(callBack, options);
	      observer.observe(about);
        observer.observe(tech);
	      observer.observe(music);
  }
  
  render() {
    return (
      // Check with Codepen support on why React partial doesn't work, so I can remove unneeded div.
        <div>
          <Nav />
          <main>
            <Pika />
            <Welcome />
            <section id="about" ref={this.about} className={this.state.aboutActive}>
              <div className="graphic">
                 <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="50" r="50"/>
                </svg>
                <img src="./css/img/jesse-min.png" />
              </div>
              <div className="text">
                <h2>About</h2>
                <p>
                  Frontend dev at Apple. I enjoy learning and tinkering with new creative tech 🎨.</p> 
              </div>
            </section>
            <section id="tech" ref={this.tech} className={this.state.techActive}>
              <div className="text">
                <h2>Technologies</h2>
                <p>
                  Most recently I have been working in the React ecosystem with all the usual suspects i.e Redux, TypeScript, Webpack, etc. I'm a big fan of all things CSS, and spend copious amounts of time browsing Codepen as well as contributing some pens myself. 
                </p>
                <a href="https://codepen.io/jesseaborden/">Check out my Codepen &rsaquo;</a>
              </div>
               <div className="graphic">
                 <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="50" r="50"/>
                </svg>
                 <svg id="codepen-logo" viewBox="0 0 1792 1792"><path d="M216 1169l603 402v-359l-334-223zm-62-144l193-129-193-129v258zm819 546l603-402-269-180-334 223v359zm-77-493l272-182-272-182-272 182zm-411-275l334-223v-359l-603 402zm960 93l193 129v-258zm-138-93l269-180-603-402v359zm485-180v546q0 41-34 64l-819 546q-21 13-43 13t-43-13l-819-546q-34-23-34-64v-546q0-41 34-64l819-546q21-13 43-13t43 13l819 546q34 23 34 64z"/></svg>
              </div>
            </section>
            <section id="music" ref={this.music} className={this.state.musicActive}>
              <div className="graphic">
                 <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="50" r="50"/>
                </svg>
                <img src="./css/img/char-jessev2.png" />
              </div>
               <div className="text">
                <h2>Music</h2>
                <p>
                  I also like to play music, and I am currently working on a home recorded EP.
                </p>
                <a href="https://soundcloud.com/thetreehouseproject">Check out my SoundCloud &rsaquo;</a>
              </div>
            </section>
            <hr />
          </main>
          <Footer />
        </div>
    )
  }

};

ReactDOM.render(
  <Page />,
  document.getElementById('app')
);