import { Helmet } from 'react-helmet';
import { withRouter } from 'react-router-dom';

import api from '~/api';
import capitalize from '~/services/capitalize';
import orFalse from '~/services/orFalse';

import Courses from './components/Courses';
import Loading from '~/components/Loading';
import Main from '~/appComponents/Main';

import css from './index.css';

import { Pie } from 'react-chartjs-2';

import { Chart, ArcElement, Tooltip } from "chart.js";
Chart.register(ArcElement, Tooltip);


import { AuthenticationActions } from '~/reducers/Authentication';
@withRouter
@connect(
  (state) => ({
    currentUser: state.global.Authentication.currentUser
  }),
  (dispatch) => ({
    signIn: (token) => AuthenticationActions.signIn(dispatch, token)
  })
)
class Page_users_id extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    signIn: PropTypes.func.isRequired,
    currentUser: orFalse(PropTypes.object).isRequired,
  }

  state = {
    speGetPage: {}
  }

  componentDidMount = () => {
    this.apiGetPage();
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.apiGetPage();
    }
  }

  // tryToFindToken = () => {
  //   const queryParams = new URLSearchParams(window.location.search);
  //   const token = queryParams.get('token');
  //   if (token) {
  //     this.props.signIn(token);
  //     this.props.history.push(`/users/${this.props.currentUser.id}`);
  //     
  //   }
  // }

  apiGetPage = () => {
    api.PageApi.getUserPage(
      (spe) => this.setState({ speGetPage: spe }),
      { userId: this.props.match.params.id }
    );
  }

  getDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  renderUser = (user) =>
    <div className="user">
      <div className="user-details">
        <h1>Profile</h1>
        <img src={user.avatarUrl} alt="avatar"/>
        <div className="right">
          <div className="username">{capitalize(user.username)}</div>

          {
            user.email &&
            <div className="email">{user.email}</div>
          }

          <div className="created-at">
            Joined {this.getDate(user.createdAt)}
          </div>
        </div>
      </div>
    </div>

  renderSkills = (skills) => {
    const max = skills[0].nOfFlashcards;

    return <div className="skills">
      <h1>Skills</h1>
      {skills.map((skill) =>
        <div className="skill" key={skill.categoryName}>
          <h2>{skill.categoryName}</h2>

          <section className="progress-bar">
            <span className="n-of-flashcards">{skill.nOfFlashcards} flashcards</span>
            <div className="inner" style={{ width: ((skill.nOfFlashcards / max) * 100).toString() + '%' }}/>
          </section>
        </div>
      )}
    </div>;
  }

  renderStats = (stats) => {
    // const max = skills[0].nOfFlashcards;
    const greenLong = '#09cc54';
    const greenMiddle = '#6fca92';
    const greenShort = '#9cc4ab';

    const data = {
      labels: [
        '  Long-term memories',
        '  Middle-term memories',
        '  Fresh memories'
      ],
      datasets: [{
        label: 'My First Dataset',
        data: [stats.easiness.longTerm, stats.easiness.middleTerm, stats.easiness.shortTerm],
        backgroundColor: [greenLong, greenMiddle, greenShort],
        hoverOffset: 0,
        borderColor: 'rgba(255, 255, 255, 1)',
        borderWidth: 1,
        hoverBackgroundColor: [greenLong, greenMiddle, greenShort]
      }],
      // responsive: true,
      // maintainAspectRatio: false
    };

    const toPercent = (easinessFor) =>
      stats.nOfProblemsLearned === 0 ?
        0 :
        Math.round((stats.easiness[easinessFor] / stats.nOfProblemsLearned) * 100, 2);

    return <div className="stats">
      <h1>Progress</h1>

      <div className="wrapper">
        <div className="left" style={{ width: 200, marginTop: 8 }}>
          <Pie data={data}/>
        </div>

        <div className="right" style={{ marginTop: 12 }}>
          <ul className="textual-stats">
            <li className="stat">
              {stats.nOfCoursesCreated} courses created
            </li>

            <li className="stat">
              {stats.nOfProblemsLearned} flashcards learned:
              <ul className="memory-levels">
                <li>
                  <div className="square" style={{ background: greenLong }}/>
                  {toPercent('longTerm')}% in long-term memory
                </li>
                <li>
                  <div className="square" style={{ background: greenMiddle }}/>
                  {toPercent('middleTerm')}% in middle-term memory
                </li>
                <li>
                  <div className="square" style={{ background: greenShort }}/>
                  {toPercent('shortTerm')}% freshly learned
                </li>
              </ul>
            </li>

            {/* <li className="stat"> */}
            {/*   Soon: */}
            {/*   <ul className="memory-levels"> */}
            {/*     <li>+ 0 flashcards to review in the next hour</li> */}
            {/*     <li>+ 20 flashcards to review in the next 24 hours</li> */}
            {/*     <li>+ 300 flashacards to review in the next week</li> */}
            {/*   </ul> */}
            {/* </li> */}
          </ul>
        </div>
      </div>


    </div>;
  }

  render = () =>
    <Main className={css.main}>
      <div className="space"/>

      <Loading spe={this.state.speGetPage}>{({ user, coursesCreated, skills, stats }) =>
        <div className="container">
          <div className="wrapper">
            {this.renderUser(user)}
            {
              skills[0] &&
              this.renderSkills(skills)
            }

            {this.renderStats(stats)}
          </div>

          {
            this.props.currentUser &&
            this.props.currentUser.id.toString() === this.props.match.params.id &&
            <section className="created-courses">
              <h1 style={{ paddingLeft: 15 }}>Courses</h1>
              <Courses location={this.props.location}/>
            </section>
          }

          <Helmet>
            <title>{capitalize(user.username)}</title>
          </Helmet>
        </div>
      }</Loading>
    </Main>
}

export default Page_users_id;
