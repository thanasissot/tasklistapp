set -e

user=$MONGO_USER
password=$MONGO_PASSWORD
db=$MONGO_DB

mongosh -u $MONGO_ROOT_USER -p $MONGO_ROOT_PASSWORD <<EOF
use ${db}

db = db.getSiblingDB("${db}");
db.createUser(
  {
    user: "${user}",
    pwd: "${password}",
    roles: [{ role: "readWrite", db: "${db}"}],
  },
);
EOF