import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers, withState, lifecycle } from 'recompose';
import { Link } from 'react-router-dom';
import { Map } from 'immutable';
import { actions as toastActions } from 'kinops/src/redux/modules/toasts';
import { actions } from '../../../redux/modules/settingsNotifications';

const fields = ['Name', 'Status', 'Subject', 'HTML Content', 'Text Content'];

const NotificationComponent = ({
  loading,
  submission,
  dirty,
  values,
  handleFieldChange,
  handleSubmit,
}) => (
  <div className="page-container page-container--notifications">
    {!loading &&
      values && (
        <div className="page-panel page-panel--scrollable">
          <div className="page-title">
            <div className="page-title__wrapper">
              <h3>
                <Link to="/">home</Link> /{` `}
                <Link to="/settings">settings</Link> /{` `}
                <Link to={`/settings/notifications`}>notifications</Link> /{` `}
              </h3>
              <h1>{submission ? submission.label : ' New'}</h1>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group required">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="Name"
                onChange={handleFieldChange}
                value={values.get('Name')}
              />
            </div>
            <div className="form-group required">
              <label>Status</label>
              <label>
                <input
                  type="radio"
                  name="Status"
                  value="Active"
                  onChange={handleFieldChange}
                  checked={values.get('Status') === 'Active'}
                />
                Active
              </label>
              <label>
                <input
                  type="radio"
                  name="Status"
                  value="Inactive"
                  onChange={handleFieldChange}
                  checked={values.get('Status') === 'Inactive'}
                />
                Inactive
              </label>
            </div>
            <div className="form-group required">
              <label htmlFor="subject">Subject</label>
              <textarea
                id="subject"
                name="Subject"
                rows="2"
                onChange={handleFieldChange}
                value={values.get('Subject')}
              />
            </div>
            <div className="form-group required">
              <label htmlFor="htmlContent">HTML Content</label>
              <textarea
                id="htmlContent"
                name="HTML Content"
                rows="8"
                onChange={handleFieldChange}
                value={values.get('HTML Content')}
              />
            </div>
            <div className="form-group required">
              <label htmlFor="textContent">Text Content</label>
              <textarea
                id="textContent"
                name="Text Content"
                rows="8"
                onChange={handleFieldChange}
                value={values.get('Text Content')}
              />
            </div>
            <div className="form-group">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!dirty || values.valueSeq().some(val => !val)}
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
  </div>
);

export const handleSubmit = props => event => {
  event.preventDefault();
  props.saveNotification(
    props.values.toJS(),
    props.submission && props.submission.id,
    () => {
      props.setDirty(false);
      props.addSuccess('notification was successfully');
    },
  );
};

export const handleFieldChange = props => event => {
  props.setDirty(true);
  props.setValues(props.values.set(event.target.name, event.target.value));
};

export const mapStateToProps = (state, { match: { params } }) => ({
  submission: state.settingsNotifications.notification,
  loading: state.settingsNotifications.notificationLoading,
  saving: state.settingsNotifications.saving,
});

export const mapDispatchToProps = {
  fetchNotification: actions.fetchNotification,
  resetNotification: actions.resetNotification,
  saveNotification: actions.saveNotification,
  fetchVariables: actions.fetchVariables,
  addSuccess: toastActions.addSuccess,
};

export const Notification = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withState('dirty', 'setDirty', false),
  withState('values', 'setValues', Map(fields.map(field => [field, '']))),
  withHandlers({
    handleSubmit,
    handleFieldChange,
  }),
  lifecycle({
    componentWillMount() {
      this.props.fetchNotification(this.props.match.params.id);
      this.props.fetchVariables();
    },
    componentWillReceiveProps(nextProps) {
      if (this.props.match.params.id !== nextProps.match.params.id) {
        this.props.fetchNotification(nextProps.match.params.id);
      }
      if (this.props.submission !== nextProps.submission) {
        this.props.setValues(
          fields.reduce(
            (values, field) =>
              values.set(field, nextProps.submission.values[field] || ''),
            Map(),
          ),
        );
        this.props.setDirty(false);
      }
    },
    componentWillUnmount() {
      this.props.resetNotification();
    },
  }),
)(NotificationComponent);
