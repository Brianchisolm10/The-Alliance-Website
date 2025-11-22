/**
 * Exercise PDF Components
 * 
 * Components for rendering exercise information in PDFs
 */

import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { ExerciseData } from '../types';
import { baseStyles } from './base';

const exerciseStyles = StyleSheet.create({
  exerciseCard: {
    marginBottom: 15,
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 4,
    border: '1 solid #e2e8f0',
  },
  exerciseName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 6,
  },
  exerciseDescription: {
    fontSize: 10,
    lineHeight: 1.5,
    color: '#475569',
    marginBottom: 8,
  },
  exerciseDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 6,
  },
  detailItem: {
    marginRight: 15,
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 9,
    color: '#64748b',
    fontWeight: 'bold',
  },
  detailValue: {
    fontSize: 10,
    color: '#334155',
  },
  exerciseNotes: {
    marginTop: 6,
    padding: 8,
    backgroundColor: '#fef3c7',
    borderRadius: 3,
  },
  notesText: {
    fontSize: 9,
    color: '#92400e',
    lineHeight: 1.4,
  },
  modifications: {
    marginTop: 6,
  },
  modificationsTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#059669',
    marginBottom: 3,
  },
  modificationItem: {
    fontSize: 9,
    color: '#065f46',
    marginLeft: 10,
    marginBottom: 2,
  },
  contraindications: {
    marginTop: 6,
    padding: 6,
    backgroundColor: '#fee2e2',
    borderRadius: 3,
  },
  contraindicationsTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#991b1b',
    marginBottom: 3,
  },
  contraindicationItem: {
    fontSize: 9,
    color: '#7f1d1d',
    marginLeft: 10,
    marginBottom: 2,
  },
});

/**
 * Single Exercise Component
 */
interface ExerciseCardProps {
  exercise: ExerciseData;
  index?: number;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, index }) => (
  <View style={exerciseStyles.exerciseCard}>
    <Text style={exerciseStyles.exerciseName}>
      {index !== undefined ? `${index + 1}. ` : ''}{exercise.name}
    </Text>
    
    {exercise.description && (
      <Text style={exerciseStyles.exerciseDescription}>
        {exercise.description}
      </Text>
    )}
    
    <View style={exerciseStyles.exerciseDetails}>
      {exercise.sets && (
        <View style={exerciseStyles.detailItem}>
          <Text style={exerciseStyles.detailLabel}>Sets: </Text>
          <Text style={exerciseStyles.detailValue}>{exercise.sets}</Text>
        </View>
      )}
      
      {exercise.reps && (
        <View style={exerciseStyles.detailItem}>
          <Text style={exerciseStyles.detailLabel}>Reps: </Text>
          <Text style={exerciseStyles.detailValue}>{exercise.reps}</Text>
        </View>
      )}
      
      {exercise.duration && (
        <View style={exerciseStyles.detailItem}>
          <Text style={exerciseStyles.detailLabel}>Duration: </Text>
          <Text style={exerciseStyles.detailValue}>{exercise.duration}</Text>
        </View>
      )}
      
      {exercise.intensity && (
        <View style={exerciseStyles.detailItem}>
          <Text style={exerciseStyles.detailLabel}>Intensity: </Text>
          <Text style={exerciseStyles.detailValue}>{exercise.intensity}</Text>
        </View>
      )}
    </View>
    
    {exercise.notes && (
      <View style={exerciseStyles.exerciseNotes}>
        <Text style={exerciseStyles.notesText}>
          💡 {exercise.notes}
        </Text>
      </View>
    )}
    
    {exercise.modifications && exercise.modifications.length > 0 && (
      <View style={exerciseStyles.modifications}>
        <Text style={exerciseStyles.modificationsTitle}>
          Modifications:
        </Text>
        {exercise.modifications.map((mod, idx) => (
          <Text key={idx} style={exerciseStyles.modificationItem}>
            • {mod}
          </Text>
        ))}
      </View>
    )}
    
    {exercise.contraindications && exercise.contraindications.length > 0 && (
      <View style={exerciseStyles.contraindications}>
        <Text style={exerciseStyles.contraindicationsTitle}>
          ⚠️ Contraindications:
        </Text>
        {exercise.contraindications.map((contra, idx) => (
          <Text key={idx} style={exerciseStyles.contraindicationItem}>
            • {contra}
          </Text>
        ))}
      </View>
    )}
  </View>
);

/**
 * Exercise List Component
 */
interface ExerciseListProps {
  exercises: ExerciseData[];
  title?: string;
}

export const ExerciseList: React.FC<ExerciseListProps> = ({ exercises, title }) => (
  <View>
    {title && (
      <Text style={baseStyles.sectionTitle}>{title}</Text>
    )}
    {exercises.map((exercise, index) => (
      <ExerciseCard key={exercise.id || index} exercise={exercise} index={index} />
    ))}
  </View>
);

/**
 * Exercise Program Phase Component
 */
interface ProgramPhaseProps {
  phase: string;
  duration: string;
  frequency: string;
  exercises: ExerciseData[];
}

export const ProgramPhase: React.FC<ProgramPhaseProps> = ({ 
  phase, 
  duration, 
  frequency, 
  exercises 
}) => (
  <View style={{ marginBottom: 20 }}>
    <View style={{ 
      backgroundColor: '#dbeafe', 
      padding: 10, 
      marginBottom: 10,
      borderRadius: 4,
    }}>
      <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#1e40af', marginBottom: 4 }}>
        {phase}
      </Text>
      <Text style={{ fontSize: 10, color: '#475569' }}>
        Duration: {duration} | Frequency: {frequency}
      </Text>
    </View>
    
    {exercises.map((exercise, index) => (
      <ExerciseCard key={exercise.id || index} exercise={exercise} index={index} />
    ))}
  </View>
);
