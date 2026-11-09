' ============================================================
'  serve-hidden.vbs  --  start serve.bat fully in the background
'
'  Double-click this file if you want the server running
'  WITHOUT a console window staying on screen.
'
'  To stop it later, run  stop-server.bat  (or restart the PC).
' ============================================================

Set fso = CreateObject("Scripting.FileSystemObject")
Set shell = CreateObject("WScript.Shell")

' Folder this .vbs sits in
here = fso.GetParentFolderName(WScript.ScriptFullName)

' The "hidden" argument tells serve.bat not to stop at its final
' pause -- otherwise a windowless cmd.exe would sit there forever.
' 0 = hidden window, False = do not wait for it to finish
shell.Run """" & here & "\serve.bat"" hidden", 0, False
