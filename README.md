// This is an enhanced version of Basic functionality
// In this version I tried to  add the following features
// 1. Added Update and Delete capability
// 2. For Update and Delete, a row ,ust be selected from the table/grid
// 3. Once row is selected for maintenance, Add button will be disabled and Update/Delete button will be enabled.
// 4. Selected values will be loaded on to the Details window for editing
// 5. Train number is the key. Once selected for modify/delete, Key  will be disabled and cannot be changed.
// 6. After changing, update button should be pressed to update the record
// 7. Update was successful. But I could not get the refreshed data on to the table. I don't know how to trigger the event listener to re-load the entire data.
// 8. Delete is performed by clicking the delete button.
// 9. I could not make refresh after successfully deleting the record.
// 10.A few more enhancements required are validation messages when try to add a  duplicate record.
// 11.Display a message once record is added, modified and deleted.
// 13.I need to check for duplicate record- Idea is to try to find a match with added key (just like we did for Update/Delete search). If found throw an error message and skip addition logic.
// 12.This application refreshes the data on screen every 60 seconds. 
// 13.Any updates or deletes will be reflected immediately or within 60 seconds since last refresh.  
// 14.A few more enhancements are to be done such as
// 15.What if I don't find a match in when I query? 