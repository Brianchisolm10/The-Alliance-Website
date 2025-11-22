/**
 * Base PDF Components
 * 
 * Reusable components for PDF generation
 */

import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';

/**
 * Base styles for PDF documents
 */
export const baseStyles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 20,
    borderBottom: '2 solid #2563eb',
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748b',
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 8,
    borderBottom: '1 solid #e2e8f0',
    paddingBottom: 4,
  },
  sectionContent: {
    fontSize: 11,
    lineHeight: 1.5,
    color: '#334155',
  },
  list: {
    marginLeft: 15,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  bullet: {
    width: 15,
    fontSize: 11,
  },
  listItemText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 1.5,
  },
  table: {
    marginTop: 10,
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1 solid #e2e8f0',
    paddingVertical: 8,
  },
  tableHeader: {
    backgroundColor: '#f1f5f9',
    fontWeight: 'bold',
  },
  tableCell: {
    flex: 1,
    fontSize: 10,
    paddingHorizontal: 5,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    borderTop: '1 solid #e2e8f0',
    paddingTop: 10,
    fontSize: 9,
    color: '#64748b',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  disclaimer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#fef3c7',
    borderRadius: 4,
    fontSize: 9,
    color: '#92400e',
  },
  badge: {
    backgroundColor: '#dbeafe',
    color: '#1e40af',
    padding: '4 8',
    borderRadius: 4,
    fontSize: 9,
    fontWeight: 'bold',
  },
});

/**
 * PDF Header Component
 */
interface PDFHeaderProps {
  title: string;
  subtitle?: string;
  userName?: string;
  date?: Date;
}

export const PDFHeader: React.FC<PDFHeaderProps> = ({ title, subtitle, userName, date }) => (
  <View style={baseStyles.header}>
    <Text style={baseStyles.headerTitle}>{title}</Text>
    {subtitle && <Text style={baseStyles.headerSubtitle}>{subtitle}</Text>}
    {userName && (
      <Text style={[baseStyles.headerSubtitle, { marginTop: 5 }]}>
        Prepared for: {userName}
      </Text>
    )}
    {date && (
      <Text style={[baseStyles.headerSubtitle, { marginTop: 2 }]}>
        Generated: {date.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}
      </Text>
    )}
  </View>
);

/**
 * PDF Footer Component
 */
interface PDFFooterProps {
  pageNumber?: number;
  totalPages?: number;
}

export const PDFFooter: React.FC<PDFFooterProps> = ({ pageNumber, totalPages }) => (
  <View style={baseStyles.footer} fixed>
    <Text>© {new Date().getFullYear()} AFYA Wellness - A Happier, Healthier You. Your Way.</Text>
    {pageNumber && totalPages && (
      <Text>Page {pageNumber} of {totalPages}</Text>
    )}
  </View>
);

/**
 * Section Component
 */
interface SectionProps {
  title: string;
  children: React.ReactNode;
}

export const Section: React.FC<SectionProps> = ({ title, children }) => (
  <View style={baseStyles.section}>
    <Text style={baseStyles.sectionTitle}>{title}</Text>
    <View style={baseStyles.sectionContent}>
      {children}
    </View>
  </View>
);

/**
 * List Component
 */
interface ListProps {
  items: string[];
  ordered?: boolean;
}

export const List: React.FC<ListProps> = ({ items, ordered = false }) => (
  <View style={baseStyles.list}>
    {items.map((item, index) => (
      <View key={index} style={baseStyles.listItem}>
        <Text style={baseStyles.bullet}>
          {ordered ? `${index + 1}.` : '•'}
        </Text>
        <Text style={baseStyles.listItemText}>{item}</Text>
      </View>
    ))}
  </View>
);

/**
 * Table Component
 */
interface TableProps {
  headers: string[];
  rows: string[][];
}

export const Table: React.FC<TableProps> = ({ headers, rows }) => (
  <View style={baseStyles.table}>
    <View style={[baseStyles.tableRow, baseStyles.tableHeader]}>
      {headers.map((header, index) => (
        <Text key={index} style={baseStyles.tableCell}>
          {header}
        </Text>
      ))}
    </View>
    {rows.map((row, rowIndex) => (
      <View key={rowIndex} style={baseStyles.tableRow}>
        {row.map((cell, cellIndex) => (
          <Text key={cellIndex} style={baseStyles.tableCell}>
            {cell}
          </Text>
        ))}
      </View>
    ))}
  </View>
);

/**
 * Disclaimer Component
 */
interface DisclaimerProps {
  text?: string;
}

export const Disclaimer: React.FC<DisclaimerProps> = ({ text }) => (
  <View style={baseStyles.disclaimer}>
    <Text>
      {text || 
        'DISCLAIMER: This wellness packet is for educational purposes only and does not constitute medical advice. ' +
        'Always consult with a qualified healthcare provider before starting any new exercise or nutrition program. ' +
        'If you experience pain, dizziness, or discomfort, stop immediately and seek medical attention.'
      }
    </Text>
  </View>
);

/**
 * Badge Component
 */
interface BadgeProps {
  text: string;
}

export const Badge: React.FC<BadgeProps> = ({ text }) => (
  <View style={baseStyles.badge}>
    <Text>{text}</Text>
  </View>
);
