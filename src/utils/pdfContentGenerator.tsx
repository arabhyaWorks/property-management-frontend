/**
 * Generates styled HTML content for the PDF export with smaller font size and border-radius
 */
const generatePDFContent = (propertyData: any, propertyId: string) => {
  // Get the current owner
  const currentOwner = propertyData.propertyRecords[propertyData.propertyRecords.length - 1];

  // Get property details
  const property = propertyData.propertyRecordDetail;

  const ekmushtDhanrashi = () => {
    if (
      property.avshesh_vikray_mulya_ekmusht_jama_dhanrashi === "0.00" ||
      property.avshesh_vikray_mulya_ekmusht_jama_dhanrashi === null ||
      property.avshesh_vikray_mulya_ekmusht_jama_dhanrashi === undefined
    ) {
      return "";
    } else {
      return `
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; font-size: 13px;">अवशेष विक्रय मूल्य एकमुश्त जमा धनराशि</td>
              <td style="padding: 8px; border: 1px solid #ddd; font-size: 13px;">${property.avshesh_vikray_mulya_ekmusht_jama_dhanrashi}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; font-size: 13px;">अवशेष विक्रय मूल्य एकमुश्त जमा दिनांक</td>
              <td style="padding: 8px; border: 1px solid #ddd; font-size: 13px;">${property.avshesh_vikray_mulya_ekmusht_jama_dinank}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; font-size: 13px;">एकमुश्त जमा धनराशि पर छूट</td>
              <td style="padding: 8px; border: 1px solid #ddd; font-size: 13px;">₹ ${property.ekmusht_jama_dhanrashi}</td>
            </tr>
              `;
    }
  };

  return `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.3; max-width: 100%; font-size: 13px;">
          <!-- Header with Logos -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAEpO2o6wUu46IYIjNM1jRBSa2aup11pBHRA&s" 
                 style="height: 90px; object-fit: contain;" 
                 alt="BIDA Logo" />
            <div style="text-align: center; flex: 1; margin: 0 20px;">
              <h1 style="font-size: 26px; font-weight:900;  margin: 0 0 5px 0;">भदोही औद्योगिक विकास प्राधिकरण</h1>
              <h1 style="font-size: 22px; font-weight:900;  margin: 0 0 5px 0;">प्रॉपर्टी मैनेजमेंट सिस्टम</h1>
              <p style="margin: 0; font-size: 12px; color: #666;">
                Print Date: ${new Date().toLocaleDateString("hi-IN")} ${new Date()
      .toLocaleTimeString("hi-IN")
      .toUpperCase()}, PID : ${propertyId}
              </p>
            </div>
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Seal_of_Uttar_Pradesh.svg/1200px-Seal_of_Uttar_Pradesh.svg.png" 
                 style="height: 70px; object-fit: contain;" 
                 alt="UP Government Seal" />
          </div>
    
          <!-- Organization Title Section -->
          <div style="background: linear-gradient(to right, #1a237e, #3949ab); color: white; padding: 12px; border-radius: 8px; margin-bottom: 18px; ">
            <h2 style="margin: 0; font-size: 18px;"><span style="font-weight:600">योजना</span> - ${propertyData.propertyRecords[0].yojna_name}</h2>
            <h2 style="margin: 0; font-size: 18px;margin-bottom:8px"><span style="font-weight:600">संपत्ति श्रेणी</span> - ${property.sampatti_sreni}, संपत्ति संख्या : ${property.avanti_sampatti_sankhya}</h2>
          </div>
    
          <!-- Current Owner Information -->
          <table style="width: 100%; border-collapse: separate; border-spacing: 0; margin-bottom: 18px; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
            <tr style="background: #f0f0f0;">
              <td colspan="2" style="padding: 8px 12px; font-weight: bold; border: 1px solid #ddd; font-size: 14px;">
                वर्तमान मालिक की मूल जानकारी
              </td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; width: 30%; font-size: 13px;">आवंटी का नाम</td>
              <td style="padding: 8px; border: 1px solid #ddd; font-size: 13px;">${propertyData.propertyRecords[0].avanti_ka_naam || "-"}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; font-size: 13px;">पिता/पति का नाम</td>
              <td style="padding: 8px; border: 1px solid #ddd; font-size: 13px;">${propertyData.propertyRecords[0].pita_pati_ka_naam || "-"}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; font-size: 13px;">स्थायी पता</td>
              <td style="padding: 8px; border: 1px solid #ddd; font-size: 13px;">${propertyData.propertyRecords[0].avanti_ka_sthayi_pata || "-"}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; font-size: 13px;">वर्तमान पता</td>
              <td style="padding: 8px; border: 1px solid #ddd; font-size: 13px;">${propertyData.propertyRecords[0].avanti_ka_vartaman_pata || "-"}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; font-size: 13px;">मोबाइल नंबर</td>
              <td style="padding: 8px; border: 1px solid #ddd; font-size: 13px;">${propertyData.propertyRecords[0].mobile_no || "-"}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; font-size: 13px;">आधार नंबर</td>
              <td style="padding: 8px; border: 1px solid #ddd; font-size: 13px;">${propertyData.propertyRecords[0].aadhar_number || "-"}</td>
            </tr>
          </table>
    
          <!-- Property Details -->
          <table style="width: 100%; border-collapse: separate; border-spacing: 0; margin-bottom: 18px; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
            <tr style="background: #f0f0f0;">
              <td colspan="2" style="padding: 8px 12px; font-weight: bold; border: 1px solid #ddd; font-size: 14px;">
                संपत्ति विवरण
              </td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; font-size: 13px; width: 30%;">संपत्ति श्रेणी</td>
              <td style="padding: 8px; border: 1px solid #ddd; font-size: 13px;">${property.sampatti_sreni || "-"}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; font-size: 13px;">आवंटी संपत्ति संख्या</td>
              <td style="padding: 8px; border: 1px solid #ddd; font-size: 13px;">${property.avanti_sampatti_sankhya || "-"}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; font-size: 13px;">संपत्ति मंजिल प्रकार</td>
              <td style="padding: 8px; border: 1px solid #ddd; font-size: 13px;">${property.property_floor_type || "-"}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; font-size: 13px;">क्षेत्रफल</td>
              <td style="padding: 8px; border: 1px solid #ddd; font-size: 13px;">${property.kshetrafal || "-"}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; font-size: 13px;">भवन निर्माण</td>
              <td style="padding: 8px; border: 1px solid #ddd; font-size: 13px;">${property.bhavan_nirman || "-"}</td>
            </tr>
          </table>
    
          <!-- Financial Details -->
          <table style="width: 100%; border-collapse: separate; border-spacing: 0; margin-bottom: 18px; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
            <tr style="background: #f0f0f0;">
              <td colspan="2" style="padding: 8px 12px; font-weight: bold; border: 1px solid #ddd; font-size: 14px;">
                वित्तीय विवरण
              </td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; width: 30%; font-size: 13px;">पंजीकरण धनराशि</td>
              <td style="padding: 8px; border: 1px solid #ddd; font-size: 13px;">₹ ${property.panjikaran_dhanrashi}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; font-size: 13px;">पंजीकरण दिनांक</td>
              <td style="padding: 8px; border: 1px solid #ddd; font-size: 13px;">${property.panjikaran_dinank}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; font-size: 13px;">आवंटन धनराशि</td>
              <td style="padding: 8px; border: 1px solid #ddd; font-size: 13px;">₹ ${property.avantan_dhanrashi}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; font-size: 13px;">आवंटन दिनांक</td>
              <td style="padding: 8px; border: 1px solid #ddd; font-size: 13px;">${property.avantan_dinank}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; font-size: 13px;">विक्रय धनराशि</td>
              <td style="padding: 8px; border: 1px solid #ddd; font-size: 13px;">₹ ${property.vikray_mulya}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; font-size: 13px;">नीलामी धनराशि</td>
              <td style="padding: 8px; border: 1px solid #ddd; font-size: 13px;">₹ ${property.auction_keemat}</td>
            </tr>
  
  ${ekmushtDhanrashi()}
          </table>
    
          <!-- Installments Section -->
          ${propertyData.installments.length > 0
      ? `
              <table style="width: 100%; border-collapse: separate; border-spacing: 0; margin-bottom: 18px; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
                <tr style="background: #f0f0f0;">
                  <td colspan="10" style="padding: 8px 12px; font-weight: bold; border: 1px solid #ddd; font-size: 14px;">
                  किश्तों का विवरण
                  </td>
                </tr>
                <tr style="background: #f8f9fa;">
                <th style="padding: 8px; border: 1px solid #ddd; text-align: right; font-size: 12px;">किश्त मूल राशि</th>
                <th style="padding: 8px; border: 1px solid #ddd; text-align: right; font-size: 12px;">किश्त ब्याज राशि</th>
                <th style="padding: 8px; border: 1px solid #ddd; text-align: right; font-size: 12px;">देय तिथि</th>
                <th style="padding: 8px; border: 1px solid #ddd; text-align: center; font-size: 12px;">भुगतान तिथि</th>
                <th style="padding: 8px; border: 1px solid #ddd; text-align: right; font-size: 12px;">विलंब दिन</th>
                <th style="padding: 8px; border: 1px solid #ddd; text-align: right; font-size: 12px;">विलंब शुल्क</th>
                <th style="padding: 8px; border: 1px solid #ddd; text-align: right; font-size: 12px;">कुल भुगतान राशि</th>
                <th style="padding: 8px; border: 1px solid #ddd; text-align: center; font-size: 12px;">status</th>
                </tr>
                ${propertyData.installments
        .map(
          (installment: any, index: number) => `
                  <tr>
                   
                    <td style="padding: 8px; border: 1px solid #ddd; text-align: right; font-size: 12px;">₹ ${parseFloat(installment.kisht_mool_paid).toFixed(2)}</td>
                    <td style="padding: 8px; border: 1px solid #ddd; text-align: right; font-size: 12px;">₹ ${parseFloat(installment.kisht_byaj_paid).toFixed(2)}</td>
                    <td style="padding: 8px; border: 1px solid #ddd; text-align: right; font-size: 12px;">${installment.payment_due_date}</td>
                    <td style="padding: 8px; border: 1px solid #ddd; text-align: center; font-size: 12px;">${installment.payment_date}</td>
                    <td style="padding: 8px; border: 1px solid #ddd; text-align: right; color: ${installment.number_of_days_delayed > 0 ? "red" : "black"}; font-size: 12px;">${installment.number_of_days_delayed}</td>
                    <td style="padding: 8px; border: 1px solid #ddd; text-align: right; font-size: 12px;">₹ ${parseFloat(installment.late_fee_amount).toFixed(2)}</td>
                    <td style="padding: 8px; border: 1px solid #ddd; text-align: right; font-size: 12px;">
                      ₹ ${parseFloat(installment.total_payment_amount_with_late_fee).toFixed(2)}
                    </td>
                     <td style="padding:0px; margin:0px; border: 1px solid #ddd; text-align: center; font-size: 12px;">
                      <div>

                         <span style="

                         background: ${installment.status === "paid" ? "#e8f5e9" : "#fff3e0"};
                          color: ${installment.status === "paid" ? "#2e7d32" : "#ef6c00"};
position: absolute;
                         margin-top: -12px;
                          margin-left: -25px;
                         padding-bottom: 10px;
                         padding-left: 5px;
                          padding-right: 5px;
                          border-radius: 3.5px;
                         
                        font-size: 11px;
                        color: ${installment.status === "initiated" ? "#ef6c00" : "#2e7d32"};
                        text-align: center;
                      ">
${installment.status ? installment.status.charAt(0).toUpperCase() + installment.status.slice(1) : "N/A"}
                      </span>

                      </div>
                    </td>
                  </tr>
                `
        )
        .join("")}
              </table>
            `
      : `
              <div style="padding: 12px; background: #f8f9fa; border: 1px solid #ddd; border-radius: 8px; text-align: center; color: #666; font-size: 13px;">
                कोई किश्त विवरण उपलब्ध नहीं है।
              </div>
            `
    }
    
          <!-- Service Charges -->
          ${propertyData.serviceCharges.length > 0
      ? `
            <table style="width: 100%; border-collapse: separate; border-spacing: 0; margin-bottom: 18px; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
              <tr style="background: #f0f0f0;">
                <td colspan="5" style="padding: 8px 12px; font-weight: bold; border: 1px solid #ddd; font-size: 14px;">
                सर्विस चार्जेस
                </td>
              </tr>
              <tr style="background: #f8f9fa;">
                <th style="padding: 8px; border: 1px solid #ddd; text-align: center; font-size: 12px;">वित्तीय वर्ष</th>
                <th style="padding: 8px; border: 1px solid #ddd; text-align: center; font-size: 12px;">सेवा शुल्क राशि</th>
                <th style="padding: 8px; border: 1px solid #ddd; text-align: center; font-size: 12px;">विलंब शुल्क</th>
                <th style="padding: 8px; border: 1px solid #ddd; text-align: center; font-size: 12px;">भुगतान तिथि</th>
                <th style="padding: 8px; border: 1px solid #ddd; text-align: center; font-size: 12px;">status</th>
              </tr>
              ${propertyData.serviceCharges
        .map(
          (charge: any, index: any) => `
                <tr>
                  <td style="padding: 8px; border: 1px solid #ddd; text-align: center; font-size: 12px;">${charge.service_charge_financial_year}</td>
                 
                  <td style="padding: 8px; border: 1px solid #ddd; text-align: right; font-size: 12px;">₹ ${parseFloat(charge.service_charge_amount).toFixed(2)}</td>
                  <td style="padding: 8px; border: 1px solid #ddd; text-align: right; font-size: 12px;">₹ ${parseFloat(charge.service_charge_late_fee).toFixed(2)}</td>
                  <td style="padding: 8px; border: 1px solid #ddd; text-align: center; font-size: 12px;">${charge.service_charge_payment_date}</td>
                   <td style="padding: 8px; border: 1px solid #ddd; text-align: center; font-size: 12px;">
                   <div>
                    <span style="
                      display: inline-block;
                      background: ${charge.status === "paid" ? "#e8f5e9" : "#fff3e0"};
                      color: ${charge.status === "paid" ? "#2e7d32" : "#ef6c00"};

                      position: absolute;
                         margin-top: -12px;
                          margin-left: -25px;
                         padding-bottom: 10px;
                         padding-left: 5px;
                          padding-right: 5px;
                          border-radius: 3.5px;
                         
                        font-size: 11px;
                    ">
                      ${ charge.status ? charge.status.charAt(0).toUpperCase()  + charge.status.slice(1) : "N/A"}
                    </span>
                  </div>
                  </td>
                </tr>
              `
        )
        .join("")}
            </table>
          `
      : `
            <div style="padding: 12px; background: #f8f9fa; border: 1px solid #ddd; border-radius: 8px; text-align: center; color: #666; font-size: 13px;">
              कोई सेवा शुल्क उपलब्ध नहीं हैं।
            </div>
          `
    }
    
          <!-- Ownership History -->
          ${propertyData.propertyRecords.length > 0
      ? `
            <table style="width: 100%; border-collapse: separate; border-spacing: 0; margin-bottom: 18px; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
              <tr style="background: #f0f0f0;">
                <td colspan="8" style="padding: 8px 12px; font-weight: bold; border: 1px solid #ddd; font-size: 14px;">
                  स्वामित्व इतिहास (वर्तमान से प्राचीनतम मालिक)
                </td>
              </tr>
              <tr style="background: #f8f9fa;">
                <th style="padding: 8px; border: 1px solid #ddd; text-align: center; font-size: 12px;">आवंटी का नाम</th>
                <th style="padding: 8px; border: 1px solid #ddd; text-align: center; font-size: 12px;">पिता/पति का नाम</th>
                <th style="padding: 8px; border: 1px solid #ddd; text-align: center; font-size: 12px;">हस्तांतरण प्रकार</th>
                <th style="padding: 8px; border: 1px solid #ddd; text-align: center; font-size: 12px;">हस्तांतरण तिथि</th>
                <th style="padding: 8px; border: 1px solid #ddd; text-align: center; font-size: 12px;">संबंध</th>
                <th style="padding: 8px; border: 1px solid #ddd; text-align: center; font-size: 12px;">मोबाइल नंबर</th>
                <th style="padding: 8px; border: 1px solid #ddd; text-align: center; font-size: 12px;">आधार नंबर</th>
                <th style="padding: 8px; border: 1px solid #ddd; text-align: right; font-size: 12px;">शुल्क</th>
              </tr>
              ${propertyData.propertyRecords
        .map(
          (record: any) => `
                <tr>
                  <td style="padding: 8px; border: 1px solid #ddd; text-align: center; font-size: 12px;">${record.avanti_ka_naam || "-"}</td>
                  <td style="padding: 8px; border: 1px solid #ddd; text-align: center; font-size: 12px;">${record.pita_pati_ka_naam || "-"}</td>
                  <td style="padding: 8px; border: 1px solid #ddd; text-align: center; font-size: 12px;">${record.transfer_type || "-"}</td>
                  <td style="padding: 8px; border: 1px solid #ddd; text-align: center; font-size: 12px;">${record.transfer_date || "उपलब्ध नहीं"}</td>
                  <td style="padding: 8px; border: 1px solid #ddd; text-align: center; font-size: 12px;">${record.relationship || "उपलब्ध नहीं"}</td>
                  <td style="padding: 8px; border: 1px solid #ddd; text-align: center; font-size: 12px;">${record.mobile_no || "-"}</td>
                  <td style="padding: 8px; border: 1px solid #ddd; text-align: center; font-size: 12px;">${record.aadhar_number || "-"}</td>
                  <td style="padding: 8px; border: 1px solid #ddd; text-align: right; font-size: 12px;">₹ ${parseFloat(record.documentation_shulk).toFixed(2)}</td>
                </tr>
              `
        )
        .join("")}
            </table>
          `
      : `
            <div style="padding: 12px; background: #f8f9fa; border: 1px solid #ddd; border-radius: 8px; text-align: center; color: #666; font-size: 13px;">
              कोई स्वामित्व इतिहास उपलब्ध नहीं है।
            </div>
          `
    }
    
          <!-- Footer -->
          <div style="margin-top: 25px; padding-top: 15px; border-top: 1px solid #ddd; text-align: center;">
            <p style="margin: 0; color: #666; font-size: 11px;">
              यह दस्तावेज़ स्वचालित रूप से उत्पन्न किया गया है।
            </p>
            <p style="margin: 4px 0 0 0; color: #666; font-size: 11px;">
              © ${new Date().getFullYear()} प्रॉपर्टी मैनेजमेंट सिस्टम। बीडा प्राधिकरण। सर्वाधिकार सुरक्षित।
            </p>
          </div>
        </div>
      `;
};

export default generatePDFContent;