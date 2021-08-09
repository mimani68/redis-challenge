# Redis challenge

## Description

All requests come as `redis stream` format and the payload contains the following fields.
```bash
{ name, email, password }
```
This service must retrive stream event and then store data as `HASHMAP` in redis and, finally, send stream event to other `stream`

```bash
{ state: 'unverified user' }
```

## Start

```bash
node index.js
```

## Redis commands

For mannual testing the project and data flow you can send data with this two command

```bash
XADD app:profile:login * name mahdi email info@imani.ir password 123
```

And final result should capture with this one

```bash
XREAD BLOCK 0 STREAMS app:wallet:first_charge $
```
## Refrence

* https://redis.io/topics/streams-intro
* https://itnext.io/redis-streams-in-action-part-1-intro-and-overview-135f66d3ab58
* https://media.trustradius.com/product-downloadables/Z4/F7/0H6ACUNFBHQJ.pdf
* https://gist.github.com/forkfork/c27d741650dd65631578771ab264dd2c
* https://medium.com/hackernoon/introduction-to-redis-streams-133f1c375cd3
* https://medium.com/manifoldco/using-redis-streams-for-time-series-25de5b12bb46
* https://towardsdev.com/scalable-event-streaming-with-redis-streams-and-go-dee5fbe8982c


# Infra

* http://unikernel.org
* https://ops.city
* https://nanovms.com