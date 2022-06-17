import CourseApi from '~/api/CourseApi';
import MyModel from '~/models/MyModel';

import Loading from '~/components/Loading';
import SelectDropdown from '~/components/SelectDropdown';
import CourseCategories from '~/appComponents/CourseCategories';
import ListOfCourseCards from '~/appComponents/ListOfCourseCards';
import { ForBeginners } from './components/ForBeginners';

import css from './index.css';

const getQuery = (location) =>
  new URLSearchParams(location.search);

const getCategoryId = (location) => {
  const categoryId = getQuery(location).get('categoryId');
  return categoryId ? parseInt(categoryId) : false;
};

@connect(
  (state) => ({
    My: state.global.My
  })
)
class Courses extends React.Component {
  static propTypes = {
    My: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
  }

  state = {
    speGetCourses: {},
    tab: 'learning'
  }

  componentDidMount = () => {
    this.apiGetCreatedCourses();
  }

  apiGetCreatedCourses = () =>
    CourseApi.selectAllCreated(
      spe => this.setState({ speGetCreatedCourses: spe })
    )

  filterCoursesForCategory = (coursesData) => {
    const categoryId = getCategoryId(this.props.location);
    if (categoryId) {
      return coursesData.filter((courseData) =>
        courseData.course.course_category_id === categoryId
      );
    } else {
      return coursesData;
    }
  }

  filterCourseCategoriesForUser = (courseCategories) => {
    const coursesData = this.state.tab === 'learning' ?
      this.state.speGetCourses.payload :
      this.state.speGetCreatedCourses.payload;

    return courseCategories.map((courseCategory) => ({
      ...courseCategory,
      amountOfCourses: coursesData.filter((courseData) =>
        courseData.course.courseCategoryId === courseCategory.id
      ).length
    }));
  }

  renderFilter = () =>
    <SelectDropdown
      className="sort-by-dropdown-wrapper standard-dropdown-wrapper standard-input -Select"
      dropdownClassName="standard-dropdown -purple"
      value={this.state.tab}
      updateValue={(tab) => this.setState({ tab })}
      possibleValues={{
        learning: 'Learning',
        created: 'Created'
      }}
      renderLi={(value, humanValue) => humanValue}
    />

  getCourseDtos = () => {
    const courseDtos = this.props.My.courses.map(MyModel.dtoToCourseCardProps);
    MyModel.sortByHowMuchToDo(courseDtos);
    return courseDtos;
  }

  filterCourseCategoriesForUserLearning = (courseCategories) => {
    return courseCategories.map((courseCategory) => ({
      ...courseCategory,
      amountOfCourses: this.props.My.courses.filter((course) =>
        course.course.course_category_id === courseCategory.id
      ).length
    }));
  }

  renderLearningTab = (courseCategoryGroups, courseCategories) =>
    <Loading spe={this.props.My.speCourses}>{() =>
      <div className="container standard-navigation_and_courses">
        <div className="left">
          <CourseCategories
            selectedCourseCategoryId={getCategoryId(this.props.location)}
            courseCategoryGroups={courseCategoryGroups}
            courseCategories={this.filterCourseCategoriesForUserLearning(courseCategories)}
            ifShowAmountOfCoursesInCategory
          />
        </div>
        <div className="right">
          {/* <div className="title_and_sorting"> */}
          {/* <h1 className="title">My Courses</h1> */}
          {/* {this.renderFilter()} */}
          {/* </div> */}
          {this.props.My.courses.length === 0 ?
            <ForBeginners/> :
            <ListOfCourseCards
              className="list-of-courses"
              type="learnReview"
              courseDtos={this.filterCoursesForCategory(this.getCourseDtos())}
            />}
        </div>
      </div>
    }</Loading>

  renderCreatedTab = (courseCategoryGroups, courseCategories) =>
    <Loading spe={this.state.speGetCreatedCourses}>{(coursesData) =>
      coursesData.length === 0 ?
        <ForBeginners/> :
        <div className="container standard-navigation_and_courses">
          <div className="left">
            <CourseCategories
              selectedCourseCategoryId={getCategoryId(this.props.location)}
              courseCategoryGroups={courseCategoryGroups}
              courseCategories={this.filterCourseCategoriesForUser(courseCategories)}
              ifShowAmountOfCoursesInCategory
            />
          </div>
          <div className="right">
            <div className="title_and_sorting">
              <h1 className="title">My Courses</h1>

              {this.renderFilter()}
            </div>

            <ListOfCourseCards
              className="list-of-courses"
              type="simple"
              courseDtos={this.filterCoursesForCategory(coursesData)}
            />
          </div>
        </div>
    }</Loading>

  render = () =>
    <section className={css.main}>
      <Loading spe={this.props.My.speCategories}>{({ courseCategoryGroups, courseCategories }) =>
        this.state.tab === 'learning' ?
          this.renderLearningTab(courseCategoryGroups, courseCategories) :
          this.renderCreatedTab(courseCategoryGroups, courseCategories)
      }</Loading>
    </section>
}

export default Courses;
