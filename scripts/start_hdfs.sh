HADOOP_HOME=/usr/local/hadoop
export HADOOP_HOME
export HADOOP_CONF_DIR="$HADOOP_HOME/etc/hadoop"

# Format namenode (only first time)
echo "Formatting HDFS namenode..."
$HADOOP_HOME/bin/hdfs namenode -format -force

# Start HDFS services
echo "Starting HDFS daemons..."
$HADOOP_HOME/sbin/start-dfs.sh

# Check HDFS status
$HADOOP_HOME/bin/hdfs dfsadmin -report