/**
 * Training Packet PDF Template
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
import { TrainingPacketContent, ExerciseData } from '../types';

interface TrainingPacketProps {
  content: TrainingPacketContent;
}

export const TrainingPacketTemplate: React.FC<TrainingPacketProps> = ({
  content,
}) => {
  return (
    <Document>
      <Page size="A4" style={baseStyles.page}>
        <PDFHeader
          title="Training Packet"
          subtitle="Your Personalized Training Program"
          userName={content.userName}
          date={content.generatedAt}
        />

        {/* Training Goals */}
        {content.trainingGoals && content.trainingGoals.length > 0 && (
          <Section title="Your Training Goals">
            <List items={content.trainingGoals} ordered />
          </Section>
        )}

        {/* Training Program */}
        {content.program && content.program.length > 0 && (
          <Section title="Training Program">
            {content.program.map((phase, index) => (
              <PhaseBlock key={index} phase={phase} phaseNumber={index + 1} />
            ))}
          </Section>
        )}

        {/* Progression Plan */}
        {content.progressionPlan && content.progressionPlan.length > 0 && (
          <Section title="Progression Plan">
            <List items={content.progressionPlan} ordered />
          </Section>
        )}

        {/* Safety Notes */}
        {content.safetyNotes && content.safetyNotes.length > 0 && (
          <Section title="Safety Guidelines">
            <List items={content.safetyNotes} />
          </Section>
        )}

        <Disclaimer />
        <PDFFooter />
      </Page>
    </Document>
  );
};

interface PhaseBlockProps {
  phase: {
    phase: string;
    duration: string;
    frequency: string;
    exercises: ExerciseData[];
  };
  phaseNumber: number;
}

const PhaseBlock: React.FC<PhaseBlockProps> = ({ phase, phaseNumber }) => (
  <View
    style={{
      marginBottom: 20,
      padding: 12,
      backgroundColor: '#f8fafc',
      borderLeft: '4 solid #2563eb',
    }}
  >
    <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 5 }}>
      Phase {phaseNumber}: {phase.phase}
    </Text>
    <View style={{ flexDirection: 'row', marginBottom: 10 }}>
      <Text style={{ fontSize: 10, marginRight: 15 }}>
        Duration: {phase.duration}
      </Text>
      <Text style={{ fontSize: 10 }}>Frequency: {phase.frequency}</Text>
    </View>

    <Text
      style={{
        fontSize: 11,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 8,
      }}
    >
      Exercises:
    </Text>
    {phase.exercises.map((exercise, idx) => (
      <ExerciseBlock key={idx} exercise={exercise} />
    ))}
  </View>
);

const ExerciseBlock: React.FC<{ exercise: ExerciseData }> = ({ exercise }) => (
  <View
    style={{
      marginBottom: 12,
      paddingBottom: 10,
      borderBottom: '1 solid #e2e8f0',
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
        <Text style={{ fontSize: 9, marginRight: 10, color: '#64748b' }}>
          Sets: {exercise.sets}
        </Text>
      )}
      {exercise.reps && (
        <Text style={{ fontSize: 9, marginRight: 10, color: '#64748b' }}>
          Reps: {exercise.reps}
        </Text>
      )}
      {exercise.duration && (
        <Text style={{ fontSize: 9, marginRight: 10, color: '#64748b' }}>
          Duration: {exercise.duration}
        </Text>
      )}
      {exercise.intensity && (
        <Text style={{ fontSize: 9, color: '#64748b' }}>
          Intensity: {exercise.intensity}
        </Text>
      )}
    </View>

    {exercise.modifications && exercise.modifications.length > 0 && (
      <View style={{ marginTop: 4 }}>
        <Text style={{ fontSize: 9, fontWeight: 'bold' }}>Modifications:</Text>
        <Text style={{ fontSize: 9 }}>{exercise.modifications.join(', ')}</Text>
      </View>
    )}

    {exercise.notes && (
      <Text
        style={{
          fontSize: 9,
          fontStyle: 'italic',
          marginTop: 4,
          color: '#64748b',
        }}
      >
        Note: {exercise.notes}
      </Text>
    )}

    {exercise.contraindications && exercise.contraindications.length > 0 && (
      <View
        style={{
          marginTop: 4,
          padding: 5,
          backgroundColor: '#fef2f2',
          borderRadius: 2,
        }}
      >
        <Text style={{ fontSize: 8, color: '#991b1b' }}>
          ⚠ Contraindications: {exercise.contraindications.join(', ')}
        </Text>
      </View>
    )}
  </View>
);
