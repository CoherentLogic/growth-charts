V4WGC ;FWSLC/DLW - Vitals wrapper for Growth Charts app;2016-02-19  4:33 PM
 ;;0.4.0;EWD GROWTH CHARTS;LOCL RTN;
 ;
 ; Written by David Wicksell <dlw@linux.com>
 ; Copyright © 2011-2014 Fourth Watch Software
 ; Licensed under the terms of the
 ; GNU Affero General Public License
 ; Version 3 or later.
 ; See attached copy of the License.
 ;
 ; DLW - This is a reworking of GMRVPGC for EWD/Sencha Touch apps
 ;GMRVPGC ;DBA/CJS - Pediatric Growth Chart HTML generator ;8/29/07  09:08
 ;;5.0;GEN. MED. REC. - VITALS;**[patch list]**;Oct 31, 2002;Build 11
 ;
 ;
 QUIT
 ;
PATLIST(PREFIX) ;Generates the list of patients for the combo box
 ;Using the patient XREF to match what the user types in real time
 ;
 K ^KBBMGC($J,"PATIENTS")
 N FLAG,PAT,DFN,NUM
 ;
 S PREFIX=$$UP^XLFSTR(PREFIX)
 I PREFIX'="" S PAT=$O(^DPT("B",PREFIX),-1)
 E  S PAT=PREFIX
 ;
 S NUM=1,FLAG=0
 F  S PAT=$O(^DPT("B",PAT)) D  Q:PAT=""!FLAG!(NUM>10) ;Max of 500 in list
 . I $E(PAT,1,$L(PREFIX))'=PREFIX S FLAG=1 Q
 . S DFN=$O(^DPT("B",PAT,0))
 . S ^KBBMGC($J,"PATIENTS",DFN)=PAT,NUM=NUM+1
 QUIT NUM
 ;
 ;
CHART(DFN) 
 K ^KBBMGC($J,"CHART",DFN)
 N AGEMO,DOB,DOD,SEX,TEMPDOB
 N BMI,CHART,CIRC,DATA,HEIGHT,LWMOS,U,WEIGHT
 N CANVAS,DSEX,MEDREC,VA,RDATA,PATNAME
 S U="^"
 D ENVITAL(DFN,.CHART)
 S SEX=$P(CHART,U,2),TEMPDOB=$P(^DPT(DFN,0),U,3)
 S DOB=$P(CHART,U,3),DOD=$P(CHART,U,4)
 S AGEMO=$$MNTHSOLD($$DT^XLFDT,TEMPDOB) ;Convert to months as of today
 S:DOD="" DOD="N/A"
 D PID^VADPT
 S MEDREC=VA("PID")
 S DSEX=$S(SEX="M":"Male",1:"Female")
 S PATNAME=$P(^DPT(DFN,0),U,1)
 S ^KBBMGC($J,"CHART",DFN,"PATNAME")=PATNAME
 M ^KBBMGC($J,"CHART",DFN,"MEDREC")=MEDREC
 S ^KBBMGC($J,"CHART",DFN,"SEX")=DSEX
 S ^("DOB")=DOB,^("DOD")=DOD,^("AGE")=AGEMO,^("AGECAT")="Pediatric"
 I AGEMO>(2*12) S ^("AGECAT")="Adolescent"
 I AGEMO>(20*12) S ^("AGECAT")="Adult"
 S DATA=0,LWMOS=1 F  S DATA=$O(CHART(DATA)) Q:DATA=""  D
 . S RDATA=$$ROUND(DATA)
 . S HEIGHT(RDATA)=$P(CHART(DATA),U)
 . S WEIGHT(RDATA)=$P(CHART(DATA),U,2)
 . S BMI(RDATA)=$P(CHART(DATA),U,3)
 . S CIRC(RDATA)=$P(CHART(DATA),U,4)
 . I HEIGHT(RDATA)="" Q
 . E  S LENWGHT(HEIGHT(RDATA))=WEIGHT(RDATA),LWMOS=LWMOS+1
 M ^("HEIGHT")=HEIGHT
 M ^("WEIGHT")=WEIGHT
 M ^("BMI")=BMI
 M ^("CIRC")=CIRC
 M ^("LENWGHT")=LENWGHT
 QUIT DFN
 ;
ENVITAL(DFN,V4WGC) ;External entry point, DFN is patient internal entry number
 ;
 ; We return an array passed by reference (V4WGC) in the following format:
 ; V4WGC=NAME^SEX^DOB^DOD^PID
 ; V4WGC(36)=182^77^23.10^57
 ; Where 36 is age in months, 182 is height in cm, 77 is weight in kg
 ; 23.10 is BMI, and 57 is head circumference in cm.
 ;
 K V4WGC
 ;
 N U,DT,TMP,TDOB,DOB,TDOD,X,Y,DOD,MAGE ;TDOB and TDOD are Timson formats
 ;
 S:'$D(U) U="^" D:'$D(DT) NOW^%DTC S DT=X ;Preliminary variable definitions
 S TMP=$G(^DPT(DFN,0)) Q:TMP=""
 S TDOB=$P(TMP,U,3),TDOD=$P($G(^DPT(DFN,.35)),U)
 S Y=TDOB D DD^%DT S DOB=Y S Y=TDOD D DD^%DT S DOD=Y ;DOB and DOD - pretty fmt
 S MAGE=$$MNTHSOLD($S(TDOD="":DT,1:TDOD),TDOB) ;MAGE - age in months
 S V4WGC=$P(TMP,U)_"^"_$P(TMP,U,2)_"^"_DOB
 S V4WGC=V4WGC_"^"_DOD_"^"_$P($G(^DPT(DFN,.36)),U,3)
 ;
 ; See if there are any pediatric vitals to be had
 ; ^GMR(120.5,"AA",GMRVDFN,GMRVTYP,9999999-GMRVDT,DA)="" rate on 0 node piece 8
 ; Types: 8=Height, 9=Weight, 20=Circumference/Girth, 73=Head qualifier
 ;
 N NONE,HEIGHT,WEIGHT,BMI,CIRCUM,TYPE,VDT,DA,VAGE,VAL,DIV ;VAGE is visit age
 ;
 S NONE=1 F TYPE=8,9,20 D
 . S VDT=0 F  S VDT=$O(^GMR(120.5,"AA",DFN,TYPE,VDT)) Q:VDT'>0  D
 . . S DA=+$O(^GMR(120.5,"AA",DFN,TYPE,VDT,0))
 . .;DLW - commented below because data was entered as 20 instead of 73
 . .;Q:TYPE=20&('$D(^GMR(120.5,DA,5,"B",73)))  ;Quit if not "HEAD"
 . . Q:+$G(^GMR(120.5,DA,2))  ;Quit if entered in Error
 . . S VAGE=$$MNTHSOLD(9999999-VDT,TDOB),NONE=0 ;Convert to months
 . . S VAGE(VAGE)="" ;Need to $O through all the visit dates below
 . . S VAL=$P(^GMR(120.5,DA,0),U,8)
 . . S VAL=$$ROUND($S("8,20"[TYPE:VAL*2.54,TYPE=9:VAL/2.2))
 . . S:TYPE=8 HEIGHT(VAGE)=VAL
 . . S:TYPE=9 WEIGHT(VAGE)=VAL
 . . S:TYPE=20 CIRCUM(VAGE)=VAL
 ;
 S VAGE=0 F  S VAGE=$O(VAGE(VAGE)) Q:VAGE=""  D
 . I $G(HEIGHT(VAGE))'="",$G(WEIGHT(VAGE))'="" D
 . . S:HEIGHT(VAGE)>0 BMI(VAGE)=$$ROUND((10000*WEIGHT(VAGE))/(HEIGHT(VAGE)**2))
 . S V4WGC(VAGE)=$G(HEIGHT(VAGE))_"^"_$G(WEIGHT(VAGE))
 . S V4WGC(VAGE)=V4WGC(VAGE)_"^"_$G(BMI(VAGE))_"^"_$G(CIRCUM(VAGE))
 Q
 ;
MNTHSOLD(DATE,DOB) ;convert age to months
 N RET
 ;
 S X1=DATE,X2=DOB
 D ^%DTC
 S RET=X/30.42,X=$$ROUND(X)
 ;
 Q RET
 ;
ROUND(X) ;round to first two decimals
 N RET,RET1,RET2
 ;
 S RET1=$P(X,".")_$S(X[".":".",1:"")
 S RET2=$E($P(X,".",2),1,2)
 ;
 I $E($P(X,".",2),3)'<5 S RET=RET1_(RET2+1)
 E  S RET=RET1_RET2
 ;
 Q RET
