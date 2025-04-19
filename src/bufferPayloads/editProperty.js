for (const propertyRecord of propertyRecords) {
  const property_record_id = propertyRecord.id;

  // Define fields to update and their values
  const fieldsToUpdate = {
    yojna_id: propertyRecord.yojna_id,
    property_id: propertyRecord.property_id,
    transfer_type: propertyRecord.transfer_type,
    from_user_id: propertyRecord.from_user_id,
    user_id: propertyRecord.user_id,
    previous_record_id: propertyRecord.previous_record_id,
    next_record_id: propertyRecord.next_record_id,
    transfer_date: propertyRecord.transfer_date
      ? formatDateToMySQL(propertyRecord.transfer_date.split('T')[0])
      : null,
    relationship: propertyRecord.relationship,
    avanti_ka_naam: propertyRecord.avanti_ka_naam,
    pita_pati_ka_naam: propertyRecord.pita_pati_ka_naam,
    avanti_ka_sthayi_pata: propertyRecord.avanti_ka_sthayi_pata,
    avanti_ka_vartaman_pata: propertyRecord.avanti_ka_vartaman_pata,
    mobile_no: propertyRecord.mobile_no,
    kabja_dinank: propertyRecord.kabja_dinank
      ? formatDateToMySQL(propertyRecord.kabja_dinank)
      : null,
    documentation_shulk: propertyRecord.documentation_shulk,
    aadhar_number: propertyRecord.aadhar_number,
    aadhar_photo_link: propertyRecord.aadhar_photo_link,
    documents_link: propertyRecord.documents_link,
  };

  // Filter out fields that are null, undefined, or empty strings
  const validFields = Object.entries(fieldsToUpdate)
    .filter(([key, value]) => value !== null && value !== undefined && value !== '')
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});

  // If no valid fields to update, skip this record
  if (Object.keys(validFields).length === 0) {
    continue;
  }

  // Construct the SET clause dynamically
  const setClause = Object.keys(validFields)
    .map((key) => `${key} = ?`)
    .join(', ');

  // Collect values for the query
  const values = Object.values(validFields);
  values.push(property_record_id); // Add the ID for the WHERE clause

  // Execute the UPDATE query
  await connection.query(
    `UPDATE property_record SET ${setClause} WHERE id = ?`,
    values
  );
}