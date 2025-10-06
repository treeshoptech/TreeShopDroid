import { useState } from 'react'
import './WorkOrderForm.css'
import TacticalButton from '../components/TacticalButton'
import TacticalInput from '../components/TacticalInput'
import TacticalCard from '../components/TacticalCard'
import TacticalBadge from '../components/TacticalBadge'
import TacticalDivider from '../components/TacticalDivider'
import TacticalCheckbox from '../components/TacticalCheckbox'
import TacticalRadio from '../components/TacticalRadio'
import { useCreateWorkOrder, useCustomers, useUsers } from '../hooks/useConvex'

const WorkOrderForm = ({ onSubmit, onCancel, proposalData = {} }) => {
  const createWorkOrder = useCreateWorkOrder()
  const customers = useCustomers()
  const users = useUsers()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    // Work Order Info
    workOrderNumber: `WO-${Date.now().toString().slice(-6)}`,
    customerId: proposalData.customerId || '',
    proposalId: proposalData.proposalId || undefined,

    // Scheduling
    scheduledDate: '',
    scheduledTime: '',

    // Crew Assignment
    crewMembers: [],

    // Equipment
    equipmentNeeded: [],

    // Work Details
    serviceType: proposalData.lineItems?.[0]?.service || '',
    workDescription: proposalData.lineItems?.[0]?.description || '',
    safetyNotes: '',
    jobNotes: '',

    // Status
    workOrderStatus: 'scheduled'
  })

  const crewMemberOptions = [
    { value: 'john_smith', label: 'John Smith' },
    { value: 'mike_jones', label: 'Mike Jones' },
    { value: 'sarah_wilson', label: 'Sarah Wilson' },
    { value: 'carlos_rodriguez', label: 'Carlos Rodriguez' },
    { value: 'david_brown', label: 'David Brown' }
  ]

  const equipmentOptions = [
    { value: 'chainsaw', label: 'Chainsaw' },
    { value: 'chipper', label: 'Wood Chipper' },
    { value: 'stump_grinder', label: 'Stump Grinder' },
    { value: 'bucket_truck', label: 'Bucket Truck' },
    { value: 'crane', label: 'Crane' },
    { value: 'grapple', label: 'Grapple Truck' },
    { value: 'loader', label: 'Skid Steer Loader' }
  ]

  const vehicleOptions = [
    { value: 'truck_01', label: 'Truck #01 (F-350)' },
    { value: 'truck_02', label: 'Truck #02 (F-450)' },
    { value: 'chipper_01', label: 'Chipper Truck #01' },
    { value: 'bucket_01', label: 'Bucket Truck #01' }
  ]

  const safetyOptions = [
    { value: 'traffic_control', label: 'Traffic Control Required' },
    { value: 'power_lines', label: 'Near Power Lines' },
    { value: 'confined_space', label: 'Confined Space' },
    { value: 'aerial_work', label: 'Aerial Work Platform' },
    { value: 'hazard_trees', label: 'Hazardous Trees' }
  ]

  const terrainOptions = [
    { value: 'flat', label: 'Flat Terrain' },
    { value: 'sloped', label: 'Sloped Terrain' },
    { value: 'steep', label: 'Steep Terrain' },
    { value: 'rough', label: 'Rough/Uneven' }
  ]

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleArrayToggle = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const scheduledDateTime = new Date(`${formData.scheduledDate}T${formData.scheduledTime || '08:00'}`).getTime()

      const workOrderId = await createWorkOrder({
        customerId: formData.customerId,
        proposalId: formData.proposalId,
        workOrderNumber: formData.workOrderNumber,
        status: formData.workOrderStatus,
        scheduledDate: scheduledDateTime,
        assignedCrew: formData.crewMembers,
        services: [
          {
            name: formData.serviceType,
            description: formData.workDescription,
            completed: false,
          }
        ],
        equipment: formData.equipmentNeeded,
        safetyNotes: formData.safetyNotes,
        jobNotes: formData.jobNotes,
      })

      onSubmit && onSubmit({ ...formData, workOrderId })
      alert('✅ Work Order created successfully!')
    } catch (error) {
      console.error('Error creating work order:', error)
      alert('❌ Error creating work order: ' + error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="work-order-container">
      <div className="form-header">
        <div className="header-left">
          <h1 className="form-title">
            <span className="title-bracket">[</span>
            WORK ORDER
            <span className="title-bracket">]</span>
          </h1>
          <div className="work-order-number">#{formData.workOrderNumber}</div>
        </div>
        <TacticalBadge status="workorder">WORK ORDER</TacticalBadge>
      </div>

      <form onSubmit={handleSubmit} className="work-order-form">
        {/* Job Information */}
        <TacticalCard>
          <div className="card-section-title">
            <span className="section-bracket">{'['}</span>
            JOB INFORMATION
            <span className="section-bracket">{']'}</span>
          </div>

          <div className="form-grid">
            <TacticalInput
              label="Customer Name"
              value={formData.customerName}
              onChange={(e) => handleChange('customerName', e.target.value)}
              required
            />

            <TacticalInput
              label="Phone Number"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              required
            />

            <div className="form-full-width">
              <TacticalInput
                label="Property Address"
                value={formData.propertyAddress}
                onChange={(e) => handleChange('propertyAddress', e.target.value)}
                required
              />
            </div>

            <TacticalInput
              label="Service Type"
              type="select"
              value={formData.serviceType}
              onChange={(e) => handleChange('serviceType', e.target.value)}
              options={[
                { value: 'removal', label: 'Tree Removal' },
                { value: 'trimming', label: 'Tree Trimming' },
                { value: 'stump', label: 'Stump Grinding' },
                { value: 'mulching', label: 'Forestry Mulching' },
                { value: 'assessment', label: 'Tree Assessment' },
                { value: 'emergency', label: 'Emergency Service' }
              ]}
              required
            />

            <TacticalInput
              label="Priority"
              type="select"
              value={formData.priority}
              onChange={(e) => handleChange('priority', e.target.value)}
              options={[
                { value: 'low', label: 'Low' },
                { value: 'normal', label: 'Normal' },
                { value: 'high', label: 'High' },
                { value: 'urgent', label: 'Urgent' }
              ]}
            />
          </div>
        </TacticalCard>

        {/* Scheduling */}
        <TacticalCard>
          <div className="card-section-title">
            <span className="section-bracket">{'['}</span>
            SCHEDULING
            <span className="section-bracket">{']'}</span>
          </div>

          <div className="form-grid">
            <TacticalInput
              label="Scheduled Date"
              type="text"
              placeholder="YYYY-MM-DD"
              value={formData.scheduledDate}
              onChange={(e) => handleChange('scheduledDate', e.target.value)}
              required
            />

            <TacticalInput
              label="Scheduled Time"
              type="text"
              placeholder="HH:MM"
              value={formData.scheduledTime}
              onChange={(e) => handleChange('scheduledTime', e.target.value)}
              required
            />

            <TacticalInput
              label="Est. Duration (hours)"
              type="text"
              placeholder="4"
              value={formData.estimatedDuration}
              onChange={(e) => handleChange('estimatedDuration', e.target.value)}
            />

            <TacticalInput
              label="Work Order Status"
              type="select"
              value={formData.workOrderStatus}
              onChange={(e) => handleChange('workOrderStatus', e.target.value)}
              options={[
                { value: 'scheduled', label: 'Scheduled' },
                { value: 'in_progress', label: 'In Progress' },
                { value: 'on_hold', label: 'On Hold' },
                { value: 'completed', label: 'Completed' }
              ]}
            />
          </div>
        </TacticalCard>

        {/* Crew Assignment */}
        <TacticalCard>
          <div className="card-section-title">
            <span className="section-bracket">{'['}</span>
            CREW ASSIGNMENT
            <span className="section-bracket">{']'}</span>
          </div>

          <div className="form-grid">
            <TacticalInput
              label="Crew Leader"
              type="select"
              value={formData.crewLeader}
              onChange={(e) => handleChange('crewLeader', e.target.value)}
              options={crewMemberOptions}
              required
            />

            <TacticalInput
              label="Crew Size"
              type="select"
              value={formData.crewSize}
              onChange={(e) => handleChange('crewSize', e.target.value)}
              options={[
                { value: '1', label: '1 Person' },
                { value: '2', label: '2 People' },
                { value: '3', label: '3 People' },
                { value: '4', label: '4 People' },
                { value: '5', label: '5+ People' }
              ]}
            />

            <div className="form-full-width">
              <div className="checkbox-group-label">CREW MEMBERS</div>
              <div className="checkbox-grid">
                {crewMemberOptions.map(member => (
                  <TacticalCheckbox
                    key={member.value}
                    label={member.label}
                    checked={formData.crewMembers.includes(member.value)}
                    onChange={() => handleArrayToggle('crewMembers', member.value)}
                  />
                ))}
              </div>
            </div>
          </div>
        </TacticalCard>

        {/* Equipment & Vehicles */}
        <TacticalCard>
          <div className="card-section-title">
            <span className="section-bracket">{'['}</span>
            EQUIPMENT & VEHICLES
            <span className="section-bracket">{']'}</span>
          </div>

          <div className="form-grid">
            <div className="form-full-width">
              <div className="checkbox-group-label">EQUIPMENT NEEDED</div>
              <div className="checkbox-grid">
                {equipmentOptions.map(equip => (
                  <TacticalCheckbox
                    key={equip.value}
                    label={equip.label}
                    checked={formData.equipmentNeeded.includes(equip.value)}
                    onChange={() => handleArrayToggle('equipmentNeeded', equip.value)}
                  />
                ))}
              </div>
            </div>

            <div className="form-full-width">
              <div className="checkbox-group-label">VEHICLES ASSIGNED</div>
              <div className="checkbox-grid">
                {vehicleOptions.map(vehicle => (
                  <TacticalCheckbox
                    key={vehicle.value}
                    label={vehicle.label}
                    checked={formData.vehiclesAssigned.includes(vehicle.value)}
                    onChange={() => handleArrayToggle('vehiclesAssigned', vehicle.value)}
                  />
                ))}
              </div>
            </div>
          </div>
        </TacticalCard>

        {/* Work Details */}
        <TacticalCard>
          <div className="card-section-title">
            <span className="section-bracket">{'['}</span>
            WORK DETAILS
            <span className="section-bracket">{']'}</span>
          </div>

          <div className="form-grid">
            <TacticalInput
              label="Property Type"
              type="select"
              value={formData.propertyType}
              onChange={(e) => handleChange('propertyType', e.target.value)}
              options={[
                { value: 'residential', label: 'Residential' },
                { value: 'commercial', label: 'Commercial' },
                { value: 'municipal', label: 'Municipal' },
                { value: 'hoa', label: 'HOA/Community' }
              ]}
            />

            <TacticalInput
              label="Tree Count"
              type="text"
              placeholder="Number of trees"
              value={formData.treeCount}
              onChange={(e) => handleChange('treeCount', e.target.value)}
            />

            <TacticalInput
              label="Est. Area (sq ft)"
              type="text"
              placeholder="Area"
              value={formData.estimatedArea}
              onChange={(e) => handleChange('estimatedArea', e.target.value)}
            />

            <TacticalInput
              label="Terrain Type"
              type="select"
              value={formData.terrainType}
              onChange={(e) => handleChange('terrainType', e.target.value)}
              options={terrainOptions}
            />

            <div className="form-full-width">
              <TacticalInput
                label="Work Description"
                type="textarea"
                placeholder="Detailed description of work to be performed..."
                value={formData.workDescription}
                onChange={(e) => handleChange('workDescription', e.target.value)}
                rows={4}
              />
            </div>

            <div className="form-full-width">
              <TacticalInput
                label="Special Instructions"
                type="textarea"
                placeholder="Special requirements, customer requests, etc..."
                value={formData.specialInstructions}
                onChange={(e) => handleChange('specialInstructions', e.target.value)}
                rows={3}
              />
            </div>

            <div className="form-full-width">
              <TacticalInput
                label="Access Notes"
                type="textarea"
                placeholder="Gate codes, parking instructions, access restrictions..."
                value={formData.accessNotes}
                onChange={(e) => handleChange('accessNotes', e.target.value)}
                rows={2}
              />
            </div>
          </div>
        </TacticalCard>

        {/* Safety & Compliance */}
        <TacticalCard>
          <div className="card-section-title">
            <span className="section-bracket">{'['}</span>
            SAFETY & COMPLIANCE
            <span className="section-bracket">{']'}</span>
          </div>

          <div className="form-grid">
            <div className="form-full-width">
              <div className="checkbox-group-label">SAFETY REQUIREMENTS</div>
              <div className="checkbox-grid">
                {safetyOptions.map(safety => (
                  <TacticalCheckbox
                    key={safety.value}
                    label={safety.label}
                    checked={formData.safetyRequirements.includes(safety.value)}
                    onChange={() => handleArrayToggle('safetyRequirements', safety.value)}
                  />
                ))}
              </div>
            </div>

            <TacticalCheckbox
              label="Permits Required"
              checked={formData.permitsRequired}
              onChange={(e) => handleChange('permitsRequired', e.target.checked)}
            />

            {formData.permitsRequired && (
              <div className="form-full-width">
                <TacticalInput
                  label="Permit Numbers"
                  type="textarea"
                  placeholder="List permit numbers and types..."
                  value={formData.permitNumbers}
                  onChange={(e) => handleChange('permitNumbers', e.target.value)}
                  rows={2}
                />
              </div>
            )}
          </div>
        </TacticalCard>

        {/* Pre-Job Checklist */}
        <TacticalCard>
          <div className="card-section-title">
            <span className="section-bracket">{'['}</span>
            PRE-JOB CHECKLIST
            <span className="section-bracket">{']'}</span>
          </div>

          <div className="checklist-grid">
            <TacticalCheckbox
              label="Pre-Job Photos Taken"
              checked={formData.preJobPhotosTaken}
              onChange={(e) => handleChange('preJobPhotosTaken', e.target.checked)}
            />
            <TacticalCheckbox
              label="Customer Walkthrough Complete"
              checked={formData.customerWalkthroughComplete}
              onChange={(e) => handleChange('customerWalkthroughComplete', e.target.checked)}
            />
            <TacticalCheckbox
              label="Equipment Inspected"
              checked={formData.equipmentInspected}
              onChange={(e) => handleChange('equipmentInspected', e.target.checked)}
            />
            <TacticalCheckbox
              label="Safety Briefing Complete"
              checked={formData.safetyBriefingComplete}
              onChange={(e) => handleChange('safetyBriefingComplete', e.target.checked)}
            />
          </div>
        </TacticalCard>

        {/* Action Buttons */}
        <div className="form-actions">
          <TacticalButton
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            CANCEL
          </TacticalButton>
          <TacticalButton
            type="submit"
            variant="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'CREATING...' : 'CREATE WORK ORDER'}
          </TacticalButton>
        </div>
      </form>
    </div>
  )
}

export default WorkOrderForm
