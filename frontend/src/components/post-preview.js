import React, { Component } from 'react';
import { backendDeletePost, backendLoadPostComments, backendUpdatePost, backendVotePost } from "../actions/posts";
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import Modal from 'react-modal';
import PostForm from './post-form';

class PostPreview extends Component {


  static propTypes = {
    post: PropTypes.object.isRequired
  };

  state = {
    editPost: false
  };


  componentDidMount() {
    this.props.loadComments(this.props.post.id)
  }

  handleDelete = () => {
    this.props.delete(this.props.post.id);
  };

  submitUpdate = (data) => {
    console.log('submit with data', data);
    this.props.update(this.props.post.id, data.title, data.body);
    this.setState({editPost: false});
  };

  cancelUpdate = () => {
    this.setState({editPost: false});
  };

  showEdit = () => {
    this.setState({
      editPost: true
    });
  };

  render() {
    const {post, comments} = this.props;
    return (
      
               
        <div className="ui cards" >
        <div className="card">
          <div className="content">
            
            <div className="header">
            <h2 className="ui big header"><Link to={`/${post.category}/${post.id}`}><b>{post.title}</b></Link></h2>
            </div>
            <div className="meta">
             <Moment fromNow>{new Date(post.timestamp)}</Moment>, {comments[post.id] ? comments[post.id].length : 'no'} comments.
            </div>
            <div className="description">
            <div className="rdbl post controls">
          <i className="rdbl stacked caret up icon" onClick={this.props.vote(post.id, true)}/>
          <i className="rdbl stacked caret down icon" onClick={this.props.vote(post.id, false)}/>
        </div>
            {post.voteScore} points by {post.author}
            </div>
          </div>
          <div className="extra content">
            <div className="ui two buttons">
              <div className="ui basic green button"><span onClick={this.showEdit}>&nbsp;<i className="green edit icon"/>Edit</span></div>
              <div className="ui basic red button"><span onClick={this.handleDelete}>&nbsp;<i className="red trash outline icon"/>Delete</span></div>
            </div>
          </div>
        </div>

        <Modal
          isOpen={this.state.editPost}
          className='rdbl modal'
          overlayClassName='rdbl overlay'
          contentLabel='Edit Post Comment Form'
          ariaHideApp={false}
        >
          <PostForm submit={this.submitUpdate} cancel={this.cancelUpdate} newPost={false} category={post.category}
                    title={post.title} body={post.body} author={post.author}/>
        </Modal>

        </div>
      
    );
  }
}



function mapStateToProps({posts, comments}) {
  return {
    posts,
    comments
  }
}

function mapDispatchToProps(dispatch) {
  return {
    loadComments: backendLoadPostComments(dispatch),
    delete: backendDeletePost(dispatch),
    update: backendUpdatePost(dispatch),
    vote: backendVotePost(dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PostPreview)