library(maSigPro)
setwd(relwd)
exp=read.delim(file = expdir,sep = "\t",header = FALSE)
#exp <- read_delim("~/R workspace/actpath/sce/exp.txt","\t", escape_double = FALSE, trim_ws = TRUE)
#little_exp=exp[-which(exp[,1]=="abst#sce:"),]

#define tnum, repnum, topnum,dire
tnum=paras[1]
repnum=paras[2]


k=as.matrix(exp[,1])
little_exp=exp[,-1]
rownames(little_exp)=k
my.DATA=as.matrix(little_exp)

for(i in c(1:dim(my.DATA)[1])){mean<-mean(my.DATA[i,]);sd<-sd(my.DATA[i,]);x<-(my.DATA[i,]-mean)/sd;my.DATA[i,]<-x;}

Time<-rep(c(1:tnum),each=repnum)
#Time<-rep(c(0,2,4,6,8,10,15), 3)

Replicates<-rep(c(1:tnum),each=repnum)
#Replicates<-rep(c(1,2,3,4,5,6,7),3)
#a=my.DATA[,c(1,8,15,2,9,16,3,10,17,4,11,18,5,12,19,6,13,20,7,14,21)]
#my.DATA=a

Group<-rep(1,tnum*repnum)
my.edesign<-cbind(Time,Replicates,Group)
rownames(my.edesign)<-colnames(my.DATA)

design <- make.design.matrix(my.edesign, degree = 2)
fit <- p.vector(my.DATA, design, Q = 0.1, min.obs = 3)
tstep <- T.fit(fit, step.method = "backward", alfa = 0.05)
sigs <- get.siggenes(tstep, rsq = 0.0, vars = "groups")

result=sigs$summary$`summary[apply(summary, 1, not.all.empty), ]`[order(sigs$sig.genes$Group$sig.pvalues$`p-value`)]

write.table(result,file = "userlist",quote = FALSE,row.names = FALSE,col.names = FALSE)
#write.table(sigs$sig.genes$Group$sig.pvalues$`p-value`,file = "sigs1_p.txt",quote = FALSE,row.names = FALSE,col.names = FALSE)
