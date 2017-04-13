import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as courseActions from '../../actions/courseActions';
import CourseForm from './CourseForm';
import toastr from 'toastr';

class ManageCoursePage extends React.Component {
  constructor(props, context){
    super(props, context);

    this.state = {
      course: Object.assign({}, this.props.course),
      errors: {},
      saving: false
    };

    this.updateCourseState = this.updateCourseState.bind(this);
    this.saveCourse = this.saveCourse.bind(this);
  }

  componentWillReceiveProps(nextProps){
    if(this.props.course.id !== nextProps.course.id){
      this.setState({course: Object.assign({}, nextProps.course)});
    }
  }

  updateCourseState(event){
    const field = event.target.name;
    let course = this.state.course;
    course[field] = event.target.value;
    return this.setState({course: course });
  }

  saveCourse(event){
    event.preventDefault();
    this.setState({saving: true});
    this.props.actions.saveCourse(this.state.course)
      .then(
        () => { this.redirect(); }
      ).catch(
        (error) => { toastr.error(error); this.setState({saving: false}); }
      );
  }

  redirect(){
    this.setState({saving: false});
    toastr.success('Course Saved!');
    this.context.router.push('/courses');
  }

  render() {
    return (
        <CourseForm
          onChange={this.updateCourseState}
          onSave={this.saveCourse}
          course={this.state.course}
          errors={this.state.errors}
          allAuthors={this.props.authors}
          saving={this.state.saving}
        />
    );
  }
}

ManageCoursePage.propTypes = {
  course: PropTypes.object.isRequired,
  authors: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired
};

ManageCoursePage.contextTypes = {
  router: PropTypes.object
};

/**
 *
 * @param courses
 * @param id
 * @returns {null}
 */
function getCourseById(courses, id){
  const course = courses.filter((course) => { return course.id == id; });
  if (course) return course[0];

  return null;
}

/**
 *
 * @param state
 * @param ownProps
 * @returns {{course: {id: string, watchHref: string, title: string, authorId: string, length: string, category: string}, authors}}
 */
function mapStateToProps(state, ownProps) {
  const courseId = ownProps.params.id; //from the path /course/:id
  let course = {id: '', watchHref: '', title: '', authorId: '', length: '', category: ''};

  if (courseId && state.courses.length > 0) {
    course = getCourseById(state.courses, courseId);
  }
  const authorsFormattedForDropdown = state.authors.map((author) => {
    return {
      value: author.id,
      text: author.firstName + ' ' + author.lastName
    };
  });
  return {
    course: course,
    authors: authorsFormattedForDropdown
  };
}

/**
 *
 * @param dispatch
 * @returns {{actions: (A|B|M|N)}}
 */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(courseActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageCoursePage);