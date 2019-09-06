

# Create this repo from scratch
```
appsody repo add kabanero https://github.com/kabanero-io/collections/releases/download/v0.1.0//kabanero-index.yaml
```

```
appsody repo set-default kabanero
```
```
appsody repo list

NAME            URL
*kabanero       https://github.com/kabanero-io/collections/releases/download/v0.1.0//kabanero-index.yaml
```

```
appsody list

REPO            ID                      VERSION         TEMPLATES               DESCRIPTION
kabanero        java-microprofile       0.2.9           *default                Eclipse MicroProfile on Open Liberty & OpenJ9 using Maven
kabanero        java-spring-boot2       0.3.6           *default, kotlin        Spring Boot using OpenJ9 and Maven
kabanero        nodejs                  0.2.5           *simple                 Runtime for Node.js applications
kabanero        nodejs-express          0.2.5           *simple, skaffold       Express web framework for Node.js
kabanero        nodejs-loopback         0.1.3           *scaffold               LoopBack 4 API Framework for Node.js
```

create project
```
mkdir nodejs-express-app
cd nodejs-express-app/
appsody init nodejs-express
appsody deploy --generate-only
git init .
git add .
git commit -m "initial commit"
Create GitHub repo and push
git remote add origin git@github.com:csantanapr/kabanero-nodejs-express-app.git
git push -u origin master
```

# Deploy Manually
```
tkn pipeline list -n kabanero
```
```
NAME                                      AGE            LAST RUN   STARTED   DURATION   STATUS
java-microprofile-build-deploy-pipeline   10 hours ago   ---        ---       ---        ---
java-spring-boot2-build-deploy-pipeline   10 hours ago   ---        ---       ---        ---
nodejs-build-deploy-pipeline              10 hours ago   ---        ---       ---        ---
nodejs-express-build-deploy-pipeline      10 hours ago   ---        ---       ---        ---
nodejs-loopback-build-deploy-pipeline     10 hours ago   ---        ---       ---        ---
pipeline0                                 10 hours ago   ---        ---       ---        ---
```

```
tkn task list -n kabanero
```
```
NAME                            AGE
java-microprofile-build-task    10 hours ago
java-microprofile-deploy-task   10 hours ago
java-spring-boot2-build-task    10 hours ago
java-spring-boot2-deploy-task   10 hours ago
monitor-result-task             10 hours ago
nodejs-build-task               10 hours ago
nodejs-deploy-task              10 hours ago
nodejs-express-build-task       10 hours ago
nodejs-express-deploy-task      10 hours ago
nodejs-loopback-build-task      10 hours ago
nodejs-loopback-deploy-task     10 hours ago
pipeline0-task                  10 hours ago
```

## Grant SecurityContext to appsody-sa. Example PV uses hostPath
```
oc -n kabanero create sa appsody-sa || true
oc adm policy add-cluster-role-to-user cluster-admin -z appsody-sa -n kabanero
oc adm policy add-scc-to-user hostmount-anyuid -z appsody-sa -n kabanero
```


```
oc apply -f pipeline-resources.yaml -n kabanero
```
```
tkn resource list -n kabanero
```
```
NAME                       TYPE    DETAILS
nodejs-express-app-git     git     url: https://github.com/csantanapr/kabanero-nodejs-express-app
nodejs-express-app-image   image   url: docker-registry.default.svc:5000/kabanero/nodejs-express-app
```


```
tkn pipeline start nodejs-express-build-deploy-pipeline \
        -r git-source=nodejs-express-app-git \
        -r docker-image=nodejs-express-app-image \
        -n kabanero \
        -s appsody-sa
```

```
Pipelinerun started: nodejs-express-build-deploy-pipeline-run-g95zc

In order to track the pipelinerun progress run:
tkn pipelinerune logs nodejs-express-build-deploy-pipeline-run-g95zc -f
```
NOTICE: a typo in the output and extra `e` at the end of `pipelinerune`

```
tkn pipelinerun logs nodejs-express-build-deploy-pipeline-run-g95zc -f -n kabanero
TaskRun nodejs-express-build-deploy-pipeline-run-g95zc-build-task-hvj5k has failed
```