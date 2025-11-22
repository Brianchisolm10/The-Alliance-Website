/**
 * Recovery Packet PDF Template
 */

import React from 'react';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import {
  PDFHeader,
  PDFFooter,
  Section,
  List,
  Disclaimer,
  baseStyles,
} from '../components/base';
import { RecoveryPacketContent, ExerciseData } from '../types';

interface RecoveryPacketProps {
  content: RecoveryPacketContent;
}

export const RecoveryPacketTemplate: React.FC<RecoveryPacketProps> = ({
  content,
}) => {
  return (
    <Document>
      <Page size="A4" style={baseStyles.page}>
        <PDFHeader
          title="Recovery & Rehabilitation Packet"
          subtitle={`${content.injuryType} - ${content.recoveryStage}`}
          userName={content.userName}
          date={content.generatedAt}
        />

        {/* Recovery Goals */}
        {content.goals && content.goals.length > 0 && (
          <Section title="Recovery Goals">
            <List items={content.goals} ordered />
          </Section>
        )}

        {/* Contraindications */}
        {content.contraindications && content.contraindications.length > 0 && (
          <View
            style={{
              marginBottom: 15,
              padding: 12,
              backgroundColor: '#fef2f2',
              borderLeft: '4 solid #dc2626',
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: 'bold',
                color: '#991b1b',
                marginBottom: 8,
              }}
            >
              ⚠ Important: Activities to Avoid
            </Text>
            <List items={content.contraindications} />
          </View>
        )}

        {/* Rehabilitation Exercises */}
        {content.exercises && content.exercises.length > 0 && (
          <Section title="Rehabilitation Exercises">
            {content.exercises.map((exercise, index) => (
              <ExerciseBlock key={index} exercise={exercise} />
            ))}
          </Section>
        )}

        {/* Progression Criteria */}
        {content.progressionCriteria && content.progressionCriteria.length > 0 && (
          <Section title="Progression Criteria">
            <Text style={{ fontSize: 10, marginBottom: 8 }}>
              You may progress to the next phase when you can:
            </Text>
            <List items={content.progressionCriteria} />
          </Section>
        )}

        {/* Return to Activity Plan */}
        {content.returnToActivityPlan &&
          content.returnToActivityPlan.length > 0 && (
            <Section title="Return to Activity Plan">
              <List items={content.returnToActivityPlan} ordered />
            </Section>
          )}

        <Disclaimer
          text="DISCLAIMER: This recovery packet is for educational purposes and should be used in conjunction with guidance from your healthcare provider, physical therapist, or sports medicine professional. Stop immediately if you experience increased pain, swelling, or any concerning symptoms. Always follow your healthcare provider's specific recommendations for your injury."
        />
        <PDFFooter />
      </Page>
    </Document>
  );
};

const ExerciseBlock: React.FC<{ exercise: ExerciseData }> = ({ exercise }) => (
  <View
    style={{
      marginBottom: 12,
      padding: 10,
      backgroundColor: '#f0fdf4',
      borderRadius: 4,
      borderLeft: '3 solid #16a34a',
    }}
  >
    <Text style={{ fontWeight: 'bold', fontSize: 11, marginBottom: 4 }}>
      {exercise.name}
    </Text>
    <Text style={{ fontSize: 10, marginBottom: 4, color: '#475569' }}>
      {exercise.description}
    </Text>

    <View style={{ flexDirection: 'row', marginBottom: 3 }}>
      {exercise.sets && (
        <Text style={{ fontSize: 9, marginRight: 10, color: '#166534' }}>
          Sets: {exercise.sets}
        </Text>
      )}
      {exercise.reps && (
        <Text style={{ fontSize: 9, marginRight: 10, color: '#166534' }}>
          Reps: {exercise.reps}
        </Text>
      )}
      {exercise.duration && (
        <Text style={{ fontSize: 9, marginRight: 10, color: '#166534' }}>
          Duration: {exercise.duration}
        </Text>
      )}
      {exercise.intensity && (
        <Text style={{ fontSize: 9, color: '#166534' }}>
          Intensity: {exercise.intensity}
        </Text>
      )}
    </View>

    {exercise.notes && (
      <View
        style={{
          marginTop: 5,
          padding: 5,
          backgroundColor: '#dcfce7',
          borderRadius: 2,
        }}
      >
        <Text style={{ fontSize: 9, fontWeight: 'bold', marginBottom: 2 }}>
          Important Note:
        </Text>
        <Text style={{ fontSize: 9 }}>{exercise.notes}</Text>
      </View>
    )}

    {exercise.modifications && exercise.modifications.length > 0 && (
      <View style={{ marginTop: 5 }}>
        <Text style={{ fontSize: 9, fontWeight: 'bold' }}>
          Modifications:
        </Text>
        <Text style={{ fontSize: 9 }}>{exercise.modifications.join(', ')}</Text>
      </View>
    )}

    {exercise.contraindications && exercise.contraindications.length > 0 && (
      <View
        style={{
          marginTop: 5,
          padding: 5,
          backgroundColor: '#fee2e2',
          borderRadius: 2,
        }}
      >
        <Text style={{ fontSize: 8, color: '#991b1b', fontWeight: 'bold' }}>
          ⚠ Stop if: {exercise.contraindications.join(', ')}
        </Text>
      </View>
    )}
  </View>
);
