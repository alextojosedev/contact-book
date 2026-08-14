from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Contact

class ContactSerializer(serializers.ModelSerializer):
    owner_username = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        model = Contact
        fields = [
            'id',
            'owner',
            'owner_username',
            'name',
            'email',
            'phone',
            'company',
            'job_title',
            'category',
            'is_favorite',
            'address',
            'notes',
            'avatar_color',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'owner', 'owner_username', 'created_at', 'updated_at']


class UserSerializer(serializers.ModelSerializer):
    contacts_count = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'contacts_count']

    def get_contacts_count(self, obj):
        return obj.contacts.count()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=4)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'first_name', 'last_name']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        return user
