import React, { Fragment } from 'react';
import { connect } from '../../../redux/store';
import { compose, withProps } from 'recompose';
import {
  VictoryContainer,
  VictoryPie,
  VictoryChart,
  VictoryBar,
  VictoryGroup,
  VictoryTooltip,
  VictoryAxis,
} from 'victory';
import {
  PieChart,
  Pie,
  ResponsiveContainer,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import { Constants, Table, StateListWrapper } from 'common';
import { I18n } from '@kineticdata/react';
import moment from 'moment';
import { Record } from 'immutable';

const toInt = value => parseInt(value, 10) || 0;
const toPercent = (a, b) => (b !== 0 ? `${Math.round((a / b) * 100)}%` : '');

const Appointments = ({ appointments }) => (
  <Fragment>
    <div className="section__title">
      <I18n>Appointments</I18n>
    </div>
    {appointments.total > 0 ? (
      <Fragment>
        <I18n
          render={translate => (
            <div className="text-center">
              <div>
                <span
                  className="fa fa-square fa-fw"
                  style={{ color: Constants.COLORS.blueSky }}
                />
                {`${toPercent(
                  appointments.scheduled,
                  appointments.total,
                )} ${translate('Scheduled')} (${appointments.scheduled})`}
              </div>
              <div>
                <span
                  className="fa fa-square fa-fw"
                  style={{ color: Constants.COLORS.sunflower }}
                />
                {`${toPercent(
                  appointments.walkins,
                  appointments.total,
                )} ${translate('Walk-Ins')} (${appointments.walkins})`}
              </div>
            </div>
          )}
        />
        <div style={{ width: '100%', height: 250 }}>
          <ResponsiveContainer>
            <PieChart style={{ margin: 'auto' }}>
              <Pie innerRadius="62%" outerRadius="100%" dataKey="value">
                <Cell
                  key={`cell-Scheduled`}
                  value={appointments.scheduled}
                  fill={Constants.COLORS.blueSky}
                />
                <Cell
                  key={`cell-Walkins`}
                  value={appointments.walkins}
                  fill={Constants.COLORS.sunflower}
                />
              </Pie>
              <Pie outerRadius="55%" innerRadius="35%" dataKey="value">
                <Cell
                  key={`cell-SameDay`}
                  value={appointments.sameDay}
                  fill={Constants.COLORS.blueLake}
                />
                <Cell
                  key={`cell-Total`}
                  value={appointments.total - appointments.sameDay}
                  fill="whitesmoke"
                />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="text-center">
          <div>
            <span
              className="fa fa-square fa-fw"
              style={{ color: Constants.COLORS.blueLake }}
            />
            <I18n>Same Day Appointments</I18n> {`(${appointments.sameDay})`}
          </div>
        </div>
      </Fragment>
    ) : (
      <div className="text-center">
        <em>
          <I18n>No Appointments</I18n>
        </em>
      </div>
    )}
  </Fragment>
);

const Feedback = ({ feedback }) => (
  <Fragment>
    <div className="section__title">
      <I18n>Feedback</I18n>
    </div>
    {feedback.total > 0 ? (
      <Fragment>
        <I18n
          render={translate => (
            <div className="text-center">
              <div>
                <span
                  className="fa fa-square fa-fw"
                  style={{ color: Constants.COLORS.green }}
                />
                {`${toPercent(feedback.positive, feedback.total)} ${translate(
                  'Happy',
                )} (${feedback.positive})`}
              </div>
              <div>
                <span
                  className="fa fa-square fa-fw"
                  style={{ color: Constants.COLORS.red }}
                />
                {`${toPercent(feedback.negative, feedback.total)} ${translate(
                  'Unhappy',
                )} (${feedback.negative})`}
              </div>
            </div>
          )}
        />
        <div style={{ width: '100%', height: 250 }}>
          <ResponsiveContainer>
            <PieChart style={{ margin: 'auto' }}>
              <Pie innerRadius="62%" outerRadius="100%" dataKey="value">
                <Cell
                  key={`cell-Scheduled`}
                  value={feedback.positive}
                  fill={Constants.COLORS.green}
                />
                <Cell
                  key={`cell-Walkins`}
                  value={feedback.negative}
                  fill={Constants.COLORS.red}
                />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Fragment>
    ) : (
      <div className="text-center">
        <em>
          <I18n>No Feedback</I18n>
        </em>
      </div>
    )}
  </Fragment>
);

const Utilization = ({ utilization }) => (
  <Fragment>
    <div className="section__title">
      <I18n>Utilization</I18n>
    </div>
    {utilization.available > 0 ? (
      <Fragment>
        <div className="text-center">
          <div>
            <span
              className="fa fa-square fa-fw"
              style={{ color: Constants.COLORS.blueSky }}
            />
            {toPercent(utilization.scheduled, utilization.available)}{' '}
            <I18n>Scheduled</I18n>
          </div>
          <div>
            <span
              className="fa fa-square fa-fw"
              style={{ color: Constants.COLORS.greenGrass }}
            />
            {toPercent(utilization.actual, utilization.available)}{' '}
            <I18n>Actual</I18n>
          </div>
        </div>
        <div style={{ width: '100%', height: 250 }}>
          <ResponsiveContainer>
            <PieChart style={{ margin: 'auto' }}>
              <Pie innerRadius="62%" outerRadius="100%" dataKey="value">
                <Cell
                  key={`cell-Scheduled`}
                  value={utilization.actual}
                  fill={Constants.COLORS.greenGrass}
                />
                <Cell
                  key={`cell-Walkins`}
                  value={utilization.available - utilization.actual}
                  fill="whitesmoke"
                />
              </Pie>
              <Pie outerRadius="55%" innerRadius="35%" dataKey="value">
                <Cell
                  key={`cell-SameDay`}
                  value={utilization.scheduled}
                  fill={Constants.COLORS.blueSky}
                />
                <Cell
                  key={`cell-Total`}
                  value={utilization.available - utilization.scheduled}
                  fill="whitesmoke"
                />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Fragment>
    ) : (
      <div className="text-center">
        <em>
          <I18n>No Availability</I18n>
        </em>
      </div>
    )}
  </Fragment>
);

const TimeOfVisit = ({ timeOfVisit }) => {
  const scheduledData = Object.keys(timeOfVisit.scheduled).reduce((d, hour) => {
    d[toInt(hour)] = timeOfVisit.scheduled[hour];
    return d;
  }, Array(24).fill(0));
  const walkinsData = Object.keys(timeOfVisit.walkins).reduce((d, hour) => {
    d[toInt(hour)] = timeOfVisit.walkins[hour];
    return d;
  }, Array(24).fill(0));

  const mergeByTime = (a1, a2) =>
    a1.map(itm => ({
      ...a2.find(item => item.time === itm.time && item),
      ...itm,
    }));

  const renderLegend = props => {
    const { payload } = props;
    return (
      <div className="text-center" style={{ width: '100%' }}>
        {payload.map((entry, index) => (
          <div key={`item-${index}`} style={{ display: 'inline-block' }}>
            <span
              style={{ color: entry.color }}
              className="fa fa-square fa-fw"
            />
            {entry.value}
          </div>
        ))}
      </div>
    );
  };

  const percentChange = (x, y) => (x - y + y) * 100;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active) {
      return (
        <div
          style={{
            background: 'white',
            width: '50',
            border: '.1rem dashed gray',
            padding: '.5rem',
          }}
        >
          <div className="label">{label}</div>
          <div className="intro">{`${payload[0].name} : ${
            payload[0].value
          }`}</div>
          <div className="intro">{`${payload[1].name} : ${
            payload[1].value
          }`}</div>
          <div>
            {payload[0].value > payload[1].value
              ? `There were ${percentChange(
                  payload[0].value,
                  payload[1].value,
                )}% more ${payload[0].name} than ${payload[1].name}`
              : `There were ${percentChange(
                  payload[1].value,
                  payload[0].value,
                )}% more ${payload[1].name} than ${payload[0].name}`}
          </div>
        </div>
      );
    }

    return null;
  };
  return (
    <Fragment>
      <div className="section__title">
        <I18n>Time of Visit</I18n>
      </div>
      {Object.keys(timeOfVisit.scheduled).length > 0 ||
      Object.keys(timeOfVisit.walkins).length > 0 ? (
        <Fragment>
          <I18n
            render={translate => (
              <Fragment>
                <div style={{ width: '100%', height: 350 }}>
                  <ResponsiveContainer>
                    <BarChart
                      data={mergeByTime(
                        scheduledData.map((count, index) => ({
                          time: moment(index, 'H').format('LT'),
                          Scheduled: count,
                          label: d =>
                            `${d.time}: ${d.scheduled} ${translate(
                              'Scheduled',
                            )}`,
                        })),
                        walkinsData.map((count, index) => ({
                          time: moment(index, 'H').format('LT'),
                          'Walk-Ins': count,
                          label: d =>
                            `${d.time}: ${d.walkins} ${
                              d.z !== 1
                                ? translate('Walk-Ins')
                                : translate('Walk-In')
                            }`,
                        })),
                      )}
                    >
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend content={renderLegend} />
                      <Bar
                        dataKey="Scheduled"
                        fill={Constants.COLORS.blueSky}
                      />
                      <Bar
                        dataKey="Walk-Ins"
                        fill={Constants.COLORS.sunflower}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Fragment>
            )}
          />
        </Fragment>
      ) : (
        <div className="text-center">
          <em>
            <I18n>No Visits</I18n>
          </em>
        </div>
      )}
    </Fragment>
  );
};

const Duration = ({ durations, techBars }) => (
  <Fragment>
    <div className="section__title">
      <I18n>Average Durations</I18n>
    </div>
    {durations.length > 0 ? (
      <I18n
        render={translate => (
          <Table
            class="table-settings"
            data={durations.map(d => {
              const techBar = techBars.find(
                t => t.values['Id'] === d.schedulerId,
              );
              const schedulerName = techBar
                ? techBar.values['Name']
                : d.schedulerId;
              const actualAverage =
                d.quantity > 0 ? Math.round(d.actual / d.quantity) : null;
              return {
                ...d,
                actualAverage,
                variance:
                  d.quantity > 0
                    ? (actualAverage - d.duration) / d.duration
                    : null,
                waitTimeAverage:
                  d.quantity > 0 ? Math.round(d.waitTime / d.quantity) : null,
                schedulerName,
                sortValue: `${schedulerName} ${d.type}`,
              };
            })}
            columns={[
              {
                title: 'Event Type',
                value: 'sortValue',
                renderBodyCell: ({ value, row }) => (
                  <td>
                    <div>{translate(row.type)}</div>
                    <small className="text-muted">
                      {translate(row.schedulerName)}
                    </small>
                  </td>
                ),
              },
              {
                title: 'Scheduled',
                value: 'duration',
                renderBodyCell: ({ value }) => (
                  <td>{`${value} ${translate('min')}`}</td>
                ),
              },
              {
                title: 'Actual',
                value: 'actualAverage',
                renderBodyCell: ({ value }) => (
                  <td>
                    {value !== null ? `${value} ${translate('min')}` : ''}
                  </td>
                ),
              },
              {
                title: 'Variance',
                value: 'variance',
                renderBodyCell: ({ value, row }) => (
                  <td>{value !== null ? toPercent(value, 1) : ''}</td>
                ),
              },
              {
                title: 'Wait Time',
                value: 'waitTimeAverage',
                renderBodyCell: ({ value }) => (
                  <td>
                    {value !== null ? `${value} ${translate('min')}` : ''}
                  </td>
                ),
              },
              {
                title: 'Qty',
                value: 'quantity',
                width: '1%',
              },
            ]}
            filtering={false}
            pagination={false}
            render={({ table }) => <div className="table-wrapper">{table}</div>}
          />
        )}
      />
    ) : (
      <div className="text-center">
        <em>
          <I18n>No Event Types</I18n>
        </em>
      </div>
    )}
  </Fragment>
);

export const MetricsSummaryComponent = ({ error, metrics, ...data }) => (
  <StateListWrapper data={data} loading={!metrics} error={error}>
    {({ summary, techBars }) => (
      <div className="row">
        <div className="col-md-4 mb-5">
          <Appointments appointments={summary.appointments} />
        </div>
        <div className="col-md-4 mb-5">
          <Feedback feedback={summary.feedback} />
        </div>
        <div className="col-md-4 mb-5">
          <Utilization utilization={summary.utilization} />
        </div>
        <div className="col-xl-6 mb-5">
          <TimeOfVisit timeOfVisit={summary.timeOfVisit} />
        </div>
        <div className="col-xl-6 mb-5">
          <Duration durations={summary.durations} techBars={techBars} />
        </div>
      </div>
    )}
  </StateListWrapper>
);

export const mapStateToProps = (state, props) => ({
  error: state.metrics.error,
  metrics: state.metrics.data,
});

const Summary = Record({
  appointments: {
    walkins: 0,
    scheduled: 0,
    sameDay: 0,
  },
  feedback: {
    positive: 0,
    negative: 0,
  },
  utilization: {
    available: 0,
    actual: 0,
    scheduled: 0,
  },
  timeOfVisit: { scheduled: {}, walkins: {} },
  durations: [], // { quantity, actual, duration, schedulerId, type }
});

export const MetricsSummary = compose(
  connect(mapStateToProps),
  withProps(({ schedulerId, eventType, metrics }) => {
    if (!metrics) {
      return { summary: Summary() };
    }
    const records = schedulerId
      ? metrics.filter(m => m.schedulerId === schedulerId)
      : metrics;

    const summary = records.reduce((summary, { data }) => {
      // Add total available minutes
      summary.utilization.available += toInt(data.totalMinutesAvailable);
      // If event type is not specified, add feedback results not associated to events
      if (!eventType) {
        summary.feedback.positive += toInt(data.feedback.Positive);
        summary.feedback.negative += toInt(data.feedback.Negative);
      }
      // Iterate through all the event types
      return (
        data.eventTypes
          // If event type is selected, filter to only that type
          .filter(event => !eventType || eventType === event.type)
          .reduce((s, event) => {
            // Add appointment counts
            s.appointments.scheduled += toInt(event.scheduledAppointments);
            s.appointments.walkins += toInt(event.walkins);
            s.appointments.sameDay += toInt(event.sameDayAppointments);
            // Add feedback counts
            s.feedback.positive += toInt(event.feedback.Positive);
            s.feedback.negative += toInt(event.feedback.Negative);
            // Add total scheduled minutes and actual minutes
            s.utilization.scheduled +=
              parseInt(event.scheduledAppointments, 10) * toInt(event.duration);
            s.utilization.actual += toInt(event.scheduledTotalDuration);
            // Add time of visit counts for scheduled appointments
            Object.keys(event.scheduledAppointmentTimes).forEach(time => {
              if (!s.timeOfVisit.scheduled[time]) {
                s.timeOfVisit.scheduled[time] = toInt(
                  event.scheduledAppointmentTimes[time],
                );
              } else {
                s.timeOfVisit.scheduled[time] += toInt(
                  event.scheduledAppointmentTimes[time],
                );
              }
            });
            // Add time of visit counts for walkin appointments
            Object.keys(event.walkinAppointmentTimes).forEach(time => {
              if (!s.timeOfVisit.walkins[time]) {
                s.timeOfVisit.walkins[time] = toInt(
                  event.walkinAppointmentTimes[time],
                );
              } else {
                s.timeOfVisit.walkins[time] += toInt(
                  event.walkinAppointmentTimes[time],
                );
              }
            });
            // Add duration info
            const existingDuration = s.durations.find(
              d => d.schedulerId === data.schedulerId && d.type === event.type,
            );
            if (existingDuration) {
              existingDuration.quantity +=
                toInt(event.scheduledAppointments) + toInt(event.walkins);
              existingDuration.actual +=
                toInt(event.walkinTotalDuration) +
                toInt(event.scheduledTotalDuration);
              existingDuration.waitTime +=
                toInt(event.walkinTotalWaitTime) +
                toInt(event.scheduledTotalWaitTime);
            } else {
              s.durations.push({
                type: event.type,
                schedulerId: data.schedulerId,
                duration: toInt(event.duration),
                quantity:
                  toInt(event.scheduledAppointments) + toInt(event.walkins),
                actual:
                  toInt(event.walkinTotalDuration) +
                  toInt(event.scheduledTotalDuration),
                waitTime:
                  toInt(event.walkinTotalWaitTime) +
                  toInt(event.scheduledTotalWaitTime),
              });
            }
            return s;
          }, summary)
      );
    }, Summary().toJS());
    // Total appointments and feedback
    summary.appointments.total =
      summary.appointments.scheduled + summary.appointments.walkins;
    summary.feedback.total =
      summary.feedback.positive + summary.feedback.negative;
    return { summary };
  }),
)(MetricsSummaryComponent);
