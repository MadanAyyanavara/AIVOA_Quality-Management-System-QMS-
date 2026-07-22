import React from 'react';
import FormSelect from './FormSelect';
import { ComplaintFormData, SeverityLevel, PriorityLevel } from '../types';
import { getSeverityColor, getPriorityColor } from '../utils/formHelpers';

interface AssessmentSectionProps {
  data: ComplaintFormData;
  onUpdate: (field: keyof ComplaintFormData, value: string) => void;
  errors?: Record<string, string>;
}

const SEVERITY_LEVELS: { value: SeverityLevel; label: string }[] = [
  { value: 'Low', label: 'Low - Minimal impact' },
  { value: 'Medium', label: 'Medium - Moderate impact' },
  { value: 'High', label: 'High - Significant impact' },
  { value: 'Critical', label: 'Critical - Patient safety risk' },
];

const PRIORITY_LEVELS: { value: PriorityLevel; label: string }[] = [
  { value: 'Low', label: 'Low - Standard processing' },
  { value: 'Normal', label: 'Normal - Routine handling' },
  { value: 'High', label: 'High - Urgent review needed' },
];

export const AssessmentSection: React.FC<AssessmentSectionProps> = ({
  data,
  onUpdate,
  errors = {},
}) => {
  const severityColor = getSeverityColor(data.initialSeverity);
  const priorityColor = getPriorityColor(data.priority);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
          <span className="w-5 h-5 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold mr-2">
            4
          </span>
          Initial Assessment & Priority
        </h3>
      </div>

      <FormSelect
        label="Initial Severity Level *"
        id="initialSeverity"
        value={data.initialSeverity}
        onChange={(value) =>
          onUpdate('initialSeverity', value as SeverityLevel)
        }
        options={SEVERITY_LEVELS}
        required
        error={errors.initialSeverity}
        helpText="Assess the potential impact of this complaint"
      />

      {data.initialSeverity && (
        <div
          className={`p-3 rounded-md border ${severityColor.split(' ').slice(-2).join(' ')} ${severityColor
            .split(' ')
            .slice(0, -2)
            .join(' ')}`}
        >
          <p className="text-xs font-medium">
            Severity: <span className="font-semibold">{data.initialSeverity}</span>
          </p>
        </div>
      )}

      <FormSelect
        label="Priority Level *"
        id="priority"
        value={data.priority}
        onChange={(value) => onUpdate('priority', value as PriorityLevel)}
        options={PRIORITY_LEVELS}
        required
        error={errors.priority}
        helpText="Set processing priority for this complaint"
      />

      {data.priority && (
        <div className={`p-3 rounded-md border ${priorityColor}`}>
          <p className="text-xs font-medium">
            Priority: <span className="font-semibold">{data.priority}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default AssessmentSection;
